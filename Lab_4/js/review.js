const DEFAULT_AVATAR = "../src/svg/logo.svg";

let reviews = [
    { author: "Феликс", text: "aboba", rating: 5, photoKey: DEFAULT_AVATAR },
    { author: "Витя Дезинтегратор", text: "Сначала голова-глаза, потом прибыль", rating: 3, photoKey: DEFAULT_AVATAR },
    {author: "Криптомагнат Евгений", text: "Я вложился в эту криптомонету и теперь лежу внутри своей яхты", rating: 5, photoKey: DEFAULT_AVATAR}
];

const savedReviews = getCookie('reviews');

if (savedReviews) {
    try {
        const parsedReviews = JSON.parse(savedReviews);
        parsedReviews.forEach((savedReview, index) => {
            const adaptedReview = {
                author: savedReview.author || `Анонимный_${Date.now()}_${index}`,
                text: savedReview.text || '',
                rating: savedReview.rating || 0,
                photoKey: savedReview.photoKey || null
            };
            const exists = reviews.some(review => 
                review.author === adaptedReview.author && 
                review.text === adaptedReview.text &&
                review.rating === adaptedReview.rating
            );
            if (!exists) {
                reviews.push(adaptedReview);
                if (adaptedReview.photoKey) {
                    const photo = localStorage.getItem(adaptedReview.photoKey);
                    if (photo) {
                        reviews[reviews.length - 1].photo = photo;
                    } else {
                        reviews[reviews.length - 1].photo = DEFAULT_AVATAR;
                    }
                } else {
                    reviews[reviews.length - 1].photo = DEFAULT_AVATAR;
                }
            } else {
                console.log("Duplicate review skipped:", adaptedReview);
            }
        });

    } catch (error) {
        deleteCookie('reviews');
    }
} else {
    console.log("No saved reviews found in cookie.");
}

const showReviewsBtn = document.getElementById('show-review-btn');
const containerReviews = document.getElementById('feedback-add');
let reviewsDiv = null;
let isVisible = false;
let photoPreviewSrc = DEFAULT_AVATAR;

function renderStars(rating) {
    const maxRating = 5;
    let stars = '';
    for (let i = 1; i <= maxRating; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

function getPhotoUrl(photo) {
    return photo || DEFAULT_AVATAR;
}

function saveReviewsToCookie() {
    try {
        const reviewsForCookie = reviews.map(review => ({
            author: review.author,
            text: review.text,
            rating: review.rating,
            photoKey: review.photoKey
        }));
        console.log("Saving reviews to cookie (without photos):", reviewsForCookie);
        setCookie('reviews', JSON.stringify(reviewsForCookie), 30);
        console.log("Reviews saved, current cookie:", document.cookie);
    } catch (error) {
        console.error('Ошибка при сохранении в cookie:', error);
    }
}

function savePhotoToLocalStorage(photoData, key) {
    try {
        localStorage.setItem(key, photoData);
        console.log("Photo saved to localStorage with key:", key);
    } catch (error) {
        console.error('Ошибка при сохранении фото в localStorage:', error);
    }
}

function renderReviews(sortBy = 'rating', filterRating = null) {
    if (!reviewsDiv) {
        reviewsDiv = document.createElement('div');
        reviewsDiv.className = 'reviews-container';
        containerReviews.appendChild(reviewsDiv);
    }

    let sortedReviews = [...reviews];
    console.log("Rendering reviews, sortedReviews:", sortedReviews);
    if (sortBy === 'rating') {
        sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'author') {
        sortedReviews.sort((a, b) => a.author.localeCompare(b.author));
    }

    if (filterRating) {
        sortedReviews = sortedReviews.filter(review => review.rating === parseInt(filterRating));
    }

    reviewsDiv.innerHTML = `
        <div class="reviews-controls">
            <label>Сортировать по: 
                <select id="sort-reviews">
                    <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Рейтингу</option>
                    <option value="author" ${sortBy === 'author' ? 'selected' : ''}>Имени</option>
                </select>
            </label>
            <label>Фильтр по рейтингу: 
                <select id="filter-reviews">
                    <option value="">Все</option>
                    <option value="5" ${filterRating === '5' ? 'selected' : ''}>5</option>
                    <option value="4" ${filterRating === '4' ? 'selected' : ''}>4</option>
                    <option value="3" ${filterRating === '3' ? 'selected' : ''}>3</option>
                    <option value="2" ${filterRating === '2' ? 'selected' : ''}>2</option>
                    <option value="1" ${filterRating === '1' ? 'selected' : ''}>1</option>
                </select>
            </label>
        </div>
        <div class="reviews-list">
            ${sortedReviews.map(review => `
                <div class="review-item">
                    <div class="review-item__left">
                        <img src="${getPhotoUrl(review.photo)}" alt="${review.author}" class="review-photo">
                    </div>
                    <div class="review-item__right">
                        <h3 class="author">${review.author}</h3>
                        <p class="rating">${renderStars(review.rating)}</p>
                        <p class="text">${review.text}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <form id="review-form">
            <div class="photo-preview">
                <img src="${photoPreviewSrc}" alt="Предпросмотр" class="preview-photo">
                <input type="file" id="review-photo" accept="image/*" style="display: none;">
            </div>
            <div class="review-input">
                <div class="rating-input" data-rating="0">
                    <span class="star" data-value="1">☆</span>
                    <span class="star" data-value="2">☆</span>
                    <span class="star" data-value="3">☆</span>
                    <span class="star" data-value="4">☆</span>
                    <span class="star" data-value="5">☆</span>
                </div>
                <input type="text" id="review-author" placeholder="Ваше имя" required>
                <textarea id="review-text" placeholder="Ваш отзыв" required></textarea>
                <button type="submit" id="review-btn">Добавить отзыв</button>
            </div>
        </form>
    `;
    console.log("Rendered HTML:", reviewsDiv.innerHTML);

    const photoInput = reviewsDiv.querySelector('#review-photo');
    const previewPhoto = reviewsDiv.querySelector('.preview-photo');
    if (photoInput && previewPhoto) {
        previewPhoto.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    photoPreviewSrc = event.target.result;
                    previewPhoto.src = photoPreviewSrc;
                    previewPhoto.classList.add('has-photo');
                };
                reader.readAsDataURL(file);
            } else {
                photoPreviewSrc = DEFAULT_AVATAR;
                previewPhoto.src = photoPreviewSrc;
                previewPhoto.classList.remove('has-photo');
            }
        });
    }

    const sortSelect = reviewsDiv.querySelector('#sort-reviews');
    const filterSelect = reviewsDiv.querySelector('#filter-reviews');
    sortSelect.addEventListener('change', () => renderReviews(sortSelect.value, filterSelect.value));
    filterSelect.addEventListener('change', () => renderReviews(sortSelect.value, filterSelect.value));

    const ratingInput = reviewsDiv.querySelector('.rating-input');
    const stars = ratingInput.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                const value = parseInt(s.getAttribute('data-value'));
                s.textContent = value <= hoverRating ? '★' : '☆';
            });
        });
        star.addEventListener('mouseout', () => {
            const currentRating = parseInt(ratingInput.getAttribute('data-rating'));
            stars.forEach(s => {
                const value = parseInt(s.getAttribute('data-value'));
                s.textContent = value <= currentRating ? '★' : '☆';
            });
        });
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-value'));
            ratingInput.setAttribute('data-rating', rating);
            stars.forEach(s => {
                const value = parseInt(s.getAttribute('data-value'));
                s.textContent = value <= rating ? '★' : '☆';
            });
        });
    });

    const reviewForm = reviewsDiv.querySelector('#review-form');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const author = reviewForm.querySelector('#review-author').value.trim();
        const text = reviewForm.querySelector('#review-text').value.trim();
        const rating = parseInt(ratingInput.getAttribute('data-rating'));
        const photoInput = reviewForm.querySelector('#review-photo');
        const file = photoInput.files ? photoInput.files[0] : null;

        if (!author || author.length < 2) {
            alert('Имя должно содержать минимум 2 символа');
            return;
        }
        if (!text || text.length < 5) {
            alert('Текст отзыва должен содержать минимум 5 символов');
            return;
        }
        if (rating === 0) {
            alert('Пожалуйста, выберите оценку');
            return;
        }

        const newReview = {
            author,
            text,
            rating,
            photoKey: null
        };

        const addReview = () => {
            const exists = reviews.some(review => 
                review.author === newReview.author && 
                review.text === newReview.text &&
                review.rating === newReview.rating
            );
            if (!exists) {
                reviews.push(newReview);
                
                saveReviewsToCookie();
            } else {
                
            }
            renderReviews(sortBy, filterRating);
            if (isVisible) {
                reviewsDiv.classList.remove('hidden');
            }
            reviewForm.reset();
            photoPreviewSrc = DEFAULT_AVATAR;
            previewPhoto.src = photoPreviewSrc;
            previewPhoto.classList.remove('has-photo');
            ratingInput.setAttribute('data-rating', '0');
            stars.forEach(s => s.textContent = '☆');
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const photoData = event.target.result;
                const photoKey = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                newReview.photoKey = photoKey;
                savePhotoToLocalStorage(photoData, photoKey);
                newReview.photo = photoData;
                addReview();
            };
            reader.readAsDataURL(file);
        } else {
            newReview.photo = DEFAULT_AVATAR;
            addReview();
        }
    });

    if (isVisible) {
        reviewsDiv.classList.remove('hidden');
    } else {
        reviewsDiv.classList.add('hidden');
    }
}

function toggleReviews() {
    if (!reviewsDiv) {
        renderReviews();
        showReviewsBtn.textContent = 'Свернуть отзывы';
        isVisible = true;
    } else {
        if (isVisible) {
            reviewsDiv.classList.add('hidden');
            showReviewsBtn.textContent = 'Показать отзывы';
            isVisible = false;
        } else {
            reviewsDiv.classList.remove('hidden');
            showReviewsBtn.textContent = 'Свернуть отзывы';
            isVisible = true;
        }
    }
}

showReviewsBtn.addEventListener('click', toggleReviews);
renderReviews();