// SIDE-BY-SIDE COMPARISON
        // ═══════════════════════════════════════════════════════════════

        function renderComparison() {
            const container = document.getElementById('comparisonGrid');
            if (!container) return;

            const answersWithContent = models
                .map((m) => ({
                    ...m,
                    answer: getTrimmedAnswerValue(m.id)
                }))
                .filter((m) => m.answer);

            if (answersWithContent.length === 0) {
                container.innerHTML = '<div class="comparison-empty"><svg class="w-10 h-10 mx-auto mb-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p>No responses to compare</p><p class="text-xs mt-1">Add responses from models in step 3</p></div>';
                comparisonDirty = false;
                return;
            }

            container.innerHTML = answersWithContent.map(m => {
                const answer = m.answer;
                const rating = modelRatings[m.id] || 0;
                const ratingStars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

                return `
                <div class="comparison-card">
                    <div class="comparison-card-header">
                        <div class="flex items-center gap-2">
                            <span class="badge badge-dark">${escapeHtml(m.name)}</span>
                            <span class="badge badge-light">${escapeHtml(m.provider)}</span>
                        </div>
                        <div style="color: #facc15; font-size: 0.85rem;" title="Rating: ${rating}/5">${ratingStars}</div>
                    </div>
                    <div class="comparison-card-body">
                        <div class="md-content">${parseMarkdown(answer)}</div>
                    </div>
                    <div class="comparison-card-footer">
                        ${renderStarRating(m.id)}
                        <button class="btn btn-copy btn-sm btn-icon" data-icon-size="w-3.5 h-3.5" title="Copy model response" aria-label="Copy model response" onclick="copyModelAnswer('${m.id}', 'comp-copy-${m.id}')" id="comp-copy-${m.id}">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                </div>`;
            }).join('');

            // Render code blocks in comparison cards
            container.querySelectorAll('.comparison-card-body').forEach(el => renderCodeBlocks(el));
            comparisonDirty = false;
        }

        