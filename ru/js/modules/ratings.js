// STAR RATING SYSTEM
        // ═══════════════════════════════════════════════════════════════

        function normalizeOverallRatings(rawRatings) {
            const normalized = {};
            if (!rawRatings || typeof rawRatings !== 'object') return normalized;
            Object.entries(rawRatings).forEach(([modelId, value]) => {
                const rating = Number(value);
                if (Number.isFinite(rating) && rating > 0) {
                    normalized[modelId] = Math.min(5, Math.max(1, Math.round(rating)));
                }
            });
            return normalized;
        }

        function migrateCriteriaRatingsToOverall(rawRatings) {
            const normalized = {};
            if (!rawRatings || typeof rawRatings !== 'object') return normalized;
            Object.entries(rawRatings).forEach(([modelId, criteria]) => {
                if (!criteria || typeof criteria !== 'object') return;
                const values = Object.values(criteria)
                    .map((value) => Number(value))
                    .filter((value) => Number.isFinite(value) && value >= 1 && value <= 5);
                if (values.length > 0) {
                    normalized[modelId] = Math.min(5, Math.max(1, Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)));
                }
            });
            return normalized;
        }

        function renderStarRating(modelId) {
            const rating = modelRatings[modelId] || 0;
            let html = '<div class="star-rating" data-model-id="' + modelId + '">';
            for (let i = 1; i <= 5; i++) {
                const filled = i <= rating ? 'filled' : '';
                html += `<button class="star-btn ${filled}" onclick="setRating('${modelId}', ${i})" onmouseenter="hoverStar(event, ${i})" onmouseleave="unhoverStar(event)">★</button>`;
            }
            if (rating > 0) {
                const labels = ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично'];
                html += `<span class="rating-label">${labels[rating]}</span>`;
            }
            html += '</div>';
            return html;
        }

        function setRating(modelId, rating) {
            if (modelRatings[modelId] === rating) {
                delete modelRatings[modelId];
            } else {
                modelRatings[modelId] = rating;
            }
            comparisonDirty = true;
            updateRatingDisplay(modelId);
            refreshComparisonView();
            autoSave();
        }

        function hoverStar(event, starIndex) {
            const container = event && event.currentTarget ? event.currentTarget.closest('.star-rating') : null;
            if (!container) return;
            const stars = container.querySelectorAll('.star-btn');
            stars.forEach((star, i) => {
                if (i < starIndex) {
                    star.classList.add('hovered');
                } else {
                    star.classList.remove('hovered');
                }
            });
        }

        function unhoverStar(event) {
            const container = event && event.currentTarget ? event.currentTarget.closest('.star-rating') : null;
            if (!container) return;
            container.querySelectorAll('.star-btn').forEach(star => {
                star.classList.remove('hovered');
            });
        }

        function updateRatingDisplay(modelId) {
            const rating = modelRatings[modelId] || 0;
            const labels = ['', 'Плохо', 'Так себе', 'Нормально', 'Хорошо', 'Отлично'];
            const containers = document.querySelectorAll(`.star-rating[data-model-id="${modelId}"]`);
            if (!containers.length) return;

            containers.forEach((container) => {
                const stars = container.querySelectorAll('.star-btn');
                stars.forEach((star, i) => {
                    star.classList.toggle('filled', i < rating);
                });
                const label = container.querySelector('.rating-label');
                if (rating > 0) {
                    if (label) {
                        label.textContent = labels[rating];
                    } else {
                        const span = document.createElement('span');
                        span.className = 'rating-label';
                        span.textContent = labels[rating];
                        container.appendChild(span);
                    }
                } else if (label) {
                    label.remove();
                }
            });
        }

        function refreshComparisonView() {
            const avgEl = document.getElementById('avgRatingDisplay');
            if (avgEl) {
                avgEl.textContent = getAverageRating();
            }

            if (currentStep !== 5 || currentResultTab !== 'comparison') return;
            if (!comparisonDirty) return;

            renderComparison();
            if (avgEl) {
                avgEl.textContent = getAverageRating();
            }
        }

        function getAverageRating() {
            const ratings = Object.values(modelRatings);
            if (ratings.length === 0) return 0;
            return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        }

        // ═══════════════════════════════════════════════════════════════
        