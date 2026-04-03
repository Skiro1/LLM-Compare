#!/usr/bin/env python3
"""
Bulk translate Russian text to English in HTML/JS files.
Uses googletrans library for translation.
Only translates text content, preserves all code/structure.
"""

import re
import json
import os
import time
from pathlib import Path

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Installing deep-translator...")
    import subprocess
    subprocess.check_call(['pip', 'install', 'deep-translator'])
    from deep_translator import GoogleTranslator

translator = GoogleTranslator(source='ru', target='en')

def translate_text(text):
    """Translate a single text string from Russian to English."""
    if not text or not text.strip():
        return text
    try:
        result = translator.translate(text)
        return result if result else text
    except Exception:
        return text

def is_mostly_russian(text):
    """Check if text contains mostly Cyrillic characters."""
    if not text or len(text.strip()) < 2:
        return False
    cyrillic = sum(1 for c in text if '\u0400' <= c <= '\u04FF')
    total = sum(1 for c in text if c.isalpha())
    if total == 0:
        return False
    return cyrillic / total > 0.3

def translate_html_file(filepath):
    """Translate Russian text in an HTML file, preserving structure."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all text between HTML tags (not inside <script> or <style>)
    # Pattern to match text content between tags
    text_pattern = re.compile(r'>([^<]+)<')
    
    def replace_text(match):
        text = match.group(1)
        if is_mostly_russian(text):
            translated = translate_text(text)
            return f'>{translated}<'
        return match.group(0)
    
    # Skip script and style blocks
    # First, protect script and style blocks
    protected = {}
    counter = [0]
    
    def protect_block(match):
        key = f'__PROTECTED_{counter[0]}__'
        protected[key] = match.group(0)
        counter[0] += 1
        return key
    
    # Protect script blocks
    content = re.sub(r'<script[^>]*>.*?</script>', protect_block, content, flags=re.DOTALL)
    # Protect style blocks
    content = re.sub(r'<style[^>]*>.*?</style>', protect_block, content, flags=re.DOTALL)
    # Protect pre/code blocks
    content = re.sub(r'<pre[^>]*>.*?</pre>', protect_block, content, flags=re.DOTALL)
    content = re.sub(r'<code[^>]*>.*?</code>', protect_block, content, flags=re.DOTALL)
    
    # Translate text between tags
    content = text_pattern.sub(replace_text, content)
    
    # Also translate title attributes and placeholders
    def translate_attr(match):
        attr_name = match.group(1)
        attr_value = match.group(2)
        if is_mostly_russian(attr_value):
            return f'{attr_name}="{translate_text(attr_value)}"'
        return match.group(0)
    
    content = re.sub(r'(title|placeholder)="([^"]+)"', translate_attr, content)
    
    # Restore protected blocks
    for key, value in protected.items():
        content = content.replace(key, value)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Translated: {filepath}")

def translate_js_file(filepath):
    """Translate Russian strings in a JavaScript file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all string literals (single and double quoted)
    # Be careful not to translate variable names, function names, etc.
    
    def translate_string_literal(match):
        quote = match.group(1)
        text = match.group(2)
        if is_mostly_russian(text):
            translated = translate_text(text)
            return f'{quote}{translated}{quote}'
        return match.group(0)
    
    # Match template literals, double-quoted, and single-quoted strings
    content = re.sub(r'([`"\'])((?:(?!\1).)*?)\1', translate_string_literal, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Translated: {filepath}")

def translate_json_file(filepath):
    """Translate Russian strings in a JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all string values in JSON
    def translate_json_string(match):
        key = match.group(1)
        value = match.group(2)
        if is_mostly_russian(value):
            translated = translate_text(value)
            return f'"{key}": "{translated}"'
        return match.group(0)
    
    content = re.sub(r'"([^"]+)":\s*"([^"]*)"', translate_json_string, content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Translated: {filepath}")

def translate_md_file(filepath):
    """Translate a Markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    translated_lines = []
    for line in lines:
        if is_mostly_russian(line):
            translated = translate_text(line)
            translated_lines.append(translated)
        else:
            translated_lines.append(line)
        time.sleep(0.1)  # Rate limit
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(translated_lines)
    
    print(f"Translated: {filepath}")

def main():
    base_dir = Path(__file__).parent
    
    # Files to translate
    files = {
        'api-docs.html': translate_html_file,
        'LLM_Compare.html': translate_html_file,
        'app.js': translate_js_file,
        'docs.js': translate_js_file,
        'manifest.json': translate_json_file,
        'README.md': translate_md_file,
    }
    
    for filename, func in files.items():
        filepath = base_dir / filename
        if filepath.exists():
            try:
                func(filepath)
                time.sleep(1)  # Rate limiting between files
            except Exception as e:
                print(f"Error translating {filename}: {e}")
    
    print("\nAll files translated!")

if __name__ == '__main__':
    main()
