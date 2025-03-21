
// Через data-speed не работает скорость :(

function setupAnimations() {
    gsap.utils.toArray('.block-row').forEach(block => {
        const imageContent = block.querySelector('.image-content');
        const textContent = block.querySelector('.text-content');

        gsap.from(imageContent, {
            x: block.classList.contains('image-left') ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 60%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            }
        });

        gsap.from(textContent, {
            x: block.classList.contains('image-left') ? 100 : -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 90%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            }
        });
    });

    const headerBlock = document.querySelector('.block-row.header-block');
    if (headerBlock) {
        const headerImage = headerBlock.querySelector('.image-content img');
        if (headerImage) {
            gsap.to(headerImage, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: headerBlock,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        const headerText = headerBlock.querySelector('.text-content');
        if (headerText) {
            gsap.to(headerText, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: headerBlock,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }
}