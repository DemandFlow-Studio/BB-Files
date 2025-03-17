// Wrap all JavaScript in a window load event listener
window.addEventListener('load', function() {
    // Sound effects using Howler.js
    const sounds = {
        tick: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-2df79aa5-809f-49ab-a58a-103a24f57a1e_Derd-Bomb-15secs.wav'],
            volume: 0.5
        }),
        optionSelect: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-f6481853-f33d-4404-a566-3b68c50ec691_click.mp3'],
            volume: 0.5,
            rate: 1.2 // Play slightly faster for a more responsive feel
        }),
        win: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-47964e5d-8d30-4915-8cfb-0e711af93419_Derd_Win.wav'],
            volume: 0.7
        }),
        lose: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-08188b12-2e5e-4bcb-a154-ec11e98e3903_Derd_Lose.wav'],
            volume: 0.7
        }),
        click: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-72575a65-574c-47df-9cec-601227ce3576_click-sound.wav'],
            volume: 0.4,
            rate: 1.2 // Play slightly faster for a more responsive feel
        }),
        shake: new Howl({
            src: ['https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-f3d653ec-950a-4dc8-810f-fea4d2a16a69_wand-shake.wav'],
            volume: 0.6
        })
    };

    // Variable to track if sounds are enabled
    let soundEnabled = true;
    
    // Function to play sound if enabled
    function playSound(soundName) {
        if (soundEnabled && sounds[soundName]) {
            sounds[soundName].play();
        }
    }
    
    let quizForm = document.querySelector('#quiz-form')
    let radioFields = document.querySelectorAll('#quiz-form input')
    let submitButton = document.querySelector('#quiz-form > button')

    // Get view elements
    const startView = document.querySelector('[data-view="start"]');
    const quizView = document.querySelector('[data-view="quiz"]');
    const wonView = document.querySelector('[data-view="won"]');
    const loseView = document.querySelector('[data-view="lose"]');
    const startButton = document.querySelector('.start');
    const tryAgainButton = document.querySelector('[data-button="try-again"]');
    const timerElement = document.querySelector('[data-timer="text"]');
    const speechBubble = document.querySelector('[data-speech-bubble="text"]');

    // Disable start button initially
    startButton.disabled = true;
    startButton.style.opacity = '0.6';
    startButton.style.cursor = 'not-allowed';


   
    
    // Add loading indicator to start button
    const originalButtonText = startButton.querySelector('.button-text').textContent;
    startButton.querySelector('.button-text').textContent = 'LOADING...';

    // Store original question text
    const originalQuestion = speechBubble.textContent;

    // Timer variables
    let timeLeft = 10000; // Changed from 15000 to 10000 (10 seconds in milliseconds)
    let timerInterval;
    let resultTimeout; // For the 5-second delay
    let lastSecond = 10; // Changed from 15 to 10 to track the last second for tick sound
    
    // Animation loading status
    let animationsLoaded = {
        timer: false,
        bomb: false,
        winning: false
    };
    
    // Font loading status
    let fontsLoaded = false;
    
    // Add this at the top of your script, right after the window.addEventListener('load', function() { line
    const pageLoadTime = Date.now();
    
    // Function to check if all resources are loaded
    function checkAllResourcesLoaded() {
        const allAnimationsLoaded = Object.values(animationsLoaded).every(loaded => loaded);
        return allAnimationsLoaded && fontsLoaded;
    }
    
    // Get the logo element
    const logoLink = document.querySelector('.main-logo-link');

    // Add loading state class to body to trigger animations
    document.body.classList.add('loading-state');
    
    // Function to enable start button when everything is loaded
    function enableStartButton() {
        if (checkAllResourcesLoaded()) {
            // Get the time elapsed since page load
            const timeElapsed = Date.now() - pageLoadTime;
            const minimumLoadTime = 2000; // 2 seconds minimum
            
            // If less than minimum time has passed, wait until we reach it
            if (timeElapsed < minimumLoadTime) {
                setTimeout(() => enableStartButton(), minimumLoadTime - timeElapsed);
                return;
            }
            
            // Update button text first
            startButton.querySelector('.button-text').textContent = originalButtonText;
            
            // Add loading-complete class to body to trigger transitions
            document.body.classList.add('loading-complete');
            
            // After a short delay, enable the button and make it active
            setTimeout(() => {
                startButton.disabled = false;
                startButton.style.opacity = '1'; // Make sure opacity is set to 1
                startButton.style.cursor = 'pointer';
                startButton.classList.add('active');

                  // Add active class to sound wrapper element
        const soundWrapper = document.querySelector('[data-sound-wrapper]');
        if (soundWrapper) {
            soundWrapper.classList.add('active');
        }
                
                
                // After the transition is complete, clean up
                setTimeout(() => {
                    document.body.classList.remove('loading-state');
                    // Optional: completely remove the loading logo after transition
                    setTimeout(() => {
                        document.querySelector('.loading-logo-container').style.display = 'none';
                    }, 500);
                }, 800);
            }, 200);
            
            
        }
    }
    
    // Preload fonts using FontFaceObserver
    function preloadFonts() {
        // Add FontFaceObserver script
        const fontScript = document.createElement('script');
        fontScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.3.0/fontfaceobserver.js';
        fontScript.async = true;
        fontScript.onload = function() {
            // List of fonts to preload - update with actual fonts used in your project
            const fontFamilies = ['Inter', 'Liquid crystal', 'Classic Comic'];
            const fontPromises = fontFamilies.map(family => {
                const font = new FontFaceObserver(family);
                return font.load(null, 2500); // 5 second timeout
            });
            
            Promise.all(fontPromises)
                .then(() => {
                    
                    fontsLoaded = true;
                    enableStartButton();
                })
                .catch(err => {
                    
                    fontsLoaded = true; // Consider fonts loaded even if some fail
                    enableStartButton();
                });
        };
        
        fontScript.onerror = function() {
            
            fontsLoaded = true; // Consider fonts loaded even if observer fails
            enableStartButton();
        };
        
        document.head.appendChild(fontScript);
    }
    
    // Start preloading fonts
    preloadFonts();
    

     // Preload animations
    const animationPaths = {
        timer: 'https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-KY2DUNMZWvqqSKFHDqRK6_durd-10sec.json', // Updated to 10-second animation
        bomb: 'https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-a84abc68-6c9f-40f0-b5e9-623dd4915e30_bomb-explodes-comp-f.json',
        winning: 'https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-9f0bdba6-fc5d-4075-b617-7901399d3a51_Durd_Bomb_Diffused-V3.json'
    };
    
    // Preload animation data
    let preloadedAnimations = {};
    
    // Function to preload animation data
    function preloadAnimation(name, path) {
        return fetch(path)
            .then(response => response.json())
            .then(data => {
                preloadedAnimations[name] = data;
                animationsLoaded[name] = true;
                
                
                // Update loading status
                if (name === 'timer') {
                    // Initialize timer animation as soon as it's loaded
                    initializeTimerAnimation();
                }
                
                // Check if all animations are loaded
                enableStartButton();
                
                return data;
            })
            .catch(error => {
                console.error(`Error loading ${name} animation:`, error);
                // Mark as loaded anyway to prevent blocking the game
                animationsLoaded[name] = true;
                enableStartButton();
            });
    }
    
    // Start preloading all animations
    Promise.all([
        preloadAnimation('timer', animationPaths.timer),
        preloadAnimation('bomb', animationPaths.bomb),
        preloadAnimation('winning', animationPaths.winning)
    ]).then(() => {
        
    });
    
    // Initialize animations with preloaded data
    let timerAnimation, bombAnimation, winningAnimation;
    
    function initializeTimerAnimation() {
        if (preloadedAnimations.timer) {
            timerAnimation = lottie.loadAnimation({
                container: document.getElementById('15-sec-lottie'),
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: preloadedAnimations.timer
            });
            
            // Set initial visibility
            document.getElementById('15-sec-lottie').style.opacity = '0';
        }
    }
    
    function initializeBombAnimation() {
        if (preloadedAnimations.bomb) {
            bombAnimation = lottie.loadAnimation({
                container: document.getElementById('bomb-lottie'),
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: preloadedAnimations.bomb
            });
            
            // Set initial visibility
            document.getElementById('bomb-lottie').style.opacity = '0';
        }
    }
    
    function initializeWinningAnimation() {
        if (preloadedAnimations.winning) {
            winningAnimation = lottie.loadAnimation({
                container: document.getElementById('winning-lottie'),
                renderer: 'svg',
                loop: false,
                autoplay: false,
                animationData: preloadedAnimations.winning
            });
            
            // Set initial visibility
            document.getElementById('winning-lottie').style.opacity = '0';
        }
    }
    
    // Initialize all animations once they're loaded
    function initializeAllAnimations() {
        if (!timerAnimation && preloadedAnimations.timer) {
            initializeTimerAnimation();
        }
        
        if (!bombAnimation && preloadedAnimations.bomb) {
            initializeBombAnimation();
        }
        
        if (!winningAnimation && preloadedAnimations.winning) {
            initializeWinningAnimation();
        }
    }

    // Function to format time as MM:SS:mmm
    function formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = milliseconds % 1000;
        
        // Changed from MM:SS:mmm to just SS:mmm format
        return `${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`;
    }

    // Function to start the timer
    function startTimer() {
        // Reset time to 10 seconds (changed from 15 seconds)
        timeLeft = 10000;
        timerElement.textContent = formatTime(timeLeft);
        
        // Play the ticking sound once at the beginning
        // We'll let it play through the full 10 seconds naturally
        playSound('tick');
        
        // Clear any existing interval
        clearInterval(timerInterval);
        
        // Start a new interval
        timerInterval = setInterval(() => {
            timeLeft -= 10; // Update every 10ms for smoother countdown
            
            // Update the timer display
            timerElement.textContent = formatTime(timeLeft);
            
            // No need to play tick sound every second anymore
            // as we're using a single 10-second audio file
            
            // Check if time is up
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                
                // Change speech bubble text
                speechBubble.textContent = "Time's up!";
                
                // Disable all radio buttons and submit button immediately
                radioFields.forEach(field => {
                    field.disabled = true;
                });
                submitButton.disabled = true;
                
                // Stop the tick sound if it's still playing
                sounds.tick.stop();
                
                // Play lose sound
                playSound('lose');
                
                // Stop timer animation first to prevent the loop from showing again
                if (timerAnimation) {
                    timerAnimation.stop();
                }
                
                // Hide timer animation and show bomb animation
                document.getElementById('15-sec-lottie').style.opacity = '0';
                document.getElementById('bomb-lottie').style.opacity = '1';
                
                // Make sure bomb animation is initialized
                if (!bombAnimation) {
                    initializeBombAnimation();
                }
                
                bombAnimation.goToAndPlay(0, true);
                
                // Wait 5 seconds before showing lose view
                clearTimeout(resultTimeout);
                resultTimeout = setTimeout(() => {
                    // Show lose view, hide quiz view using the switchView function
                    switchView(quizView, loseView);
                }, 3000);
            }
        }, 10);
    }

    // Function to switch views with smooth transitions
    function switchView(hideView, showView) {
        // First completely hide the current view
        if (hideView) {
            // Add a class for fade-out animation
            hideView.classList.add('view-transitioning-out');
            hideView.classList.remove('active-view');
            
            // Wait for the fade-out animation to complete before hiding completely
            setTimeout(() => {
                hideView.style.display = 'none';
                hideView.classList.remove('view-transitioning-out');
                
                // Now that the previous view is completely hidden, show the new view
                if (showView) {
                    // Position the new view off-screen but make it visible
                    showView.style.display = 'flex';
                    showView.classList.add('view-transitioning-in');
                    
                    // Force a reflow to ensure the transition works
                    void showView.offsetHeight;
                    
                    // Trigger the transition to bring it into view
                    showView.classList.add('active-view');
                    
                    // Remove the transitioning class after animation completes
                    setTimeout(() => {
                        showView.classList.remove('view-transitioning-in');
                    }, 500);
                }
            }, 300); // Slightly shorter than the CSS transition time
        } else if (showView) {
            // If there's no view to hide, just show the new view immediately
            showView.style.display = 'flex';
            void showView.offsetHeight; // Force reflow
            showView.classList.add('active-view');
        }
    }

    // Function to animate the timer element
    function animateTimerElement() {
        const timerElement = document.querySelector('[data-timer="text"]');
        
        // Set initial position and scale
        timerElement.style.transform = 'translateY(164px) scale(1.4)';
        
        // First add the shake animation
        setTimeout(() => {
            timerElement.classList.add('timer-shake');
            // Play the shake sound when the timer shake animation starts
            playSound('shake');
            
            // After shake completes, add the return animation
            setTimeout(() => {
                timerElement.classList.remove('timer-shake');
                timerElement.classList.add('timer-return');
                
                // After return animation completes, start the timer
                setTimeout(() => {
                    timerElement.classList.remove('timer-return');
                    timerElement.style.transform = ''; // Reset to default
                    
                    // Start the timer
                    startTimer();
                    
                    // Start the lottie animation when the timer starts
                    if (timerAnimation) {
                        document.getElementById('15-sec-lottie').style.opacity = '1';
                        timerAnimation.goToAndPlay(0, true);
                    }
                }, 500); // Updated to match the new timerReturn animation duration (0.5s)
            }, 600); // Updated to match the new timerShake animation duration (0.6s)
        }, 200); // Keep the initial delay the same
    }

    // Start button click handler
    startButton.addEventListener('click', function(event) {
        // Initialize all animations if not already done
        initializeAllAnimations();
        
        // Use the new transition function
        switchView(startView, quizView);
        
        // Show the first frame of the timer animation immediately
        if (timerAnimation) {
            document.getElementById('15-sec-lottie').style.opacity = '1';
            timerAnimation.goToAndStop(0, true); // Show first frame without playing
        }
        
        // Animate the timer element first, then start the timer
        animateTimerElement();
        
        // The timer and full lottie animation will be started after the animation completes
        // startTimer() and timerAnimation.goToAndPlay() are now called inside animateTimerElement()
    });

    submitButton.disabled = true;

    radioFields = Array.from(radioFields) // Turn fields into an Array to access the ".every" method.

    // Add click event listeners to radio buttons
    radioFields.forEach(field => {
        field.addEventListener('click', () => {
            // Play option select sound
            playSound('optionSelect');
            
            // Enable submit button if any option is selected
            submitButton.disabled = !radioFields.some(field => field.checked);
            
            // Add active class to clicked radio and inactive to others
            radioFields.forEach(otherField => {
                const radioInput = otherField.parentElement.querySelector('.w-radio-input');
                if (otherField === field) {
                    // Add active class to the clicked radio
                    radioInput.classList.add('active');
                    radioInput.classList.remove('inactive');
                } else {
                    // Add inactive class to all other radios
                    radioInput.classList.add('inactive');
                    radioInput.classList.remove('active');
                }
            });
        });
    });

    quizForm.addEventListener('submit', function(event) {
        // Prevent default form submission
        event.preventDefault();
        
        // Disable all radio buttons and submit button immediately
        radioFields.forEach(field => {
            field.disabled = true;
        });
        submitButton.disabled = true;
        
        // Stop the timer
        clearInterval(timerInterval);
        
        // Stop the tick sound if it's still playing
        sounds.tick.stop();
        
        // Clear any existing timeout
        clearTimeout(resultTimeout);

        // Find the selected radio input directly
        const selectedRadio = radioFields.find(field => field.checked);
        const selectedValue = selectedRadio ? selectedRadio.value : null;
        
          console.log(selectedValue);
        
        const selectedRadioInput = selectedRadio ? selectedRadio.parentElement.querySelector('.w-radio-input') : null;
        
        // Hide timer animation
        document.getElementById('15-sec-lottie').style.opacity = '0';
        if (timerAnimation) {
            timerAnimation.pause();
        }
        
        // Check if the answer is correct (24)
        if (selectedValue === '10') {
            
            // Change speech bubble text for correct answer
            speechBubble.textContent = "CONGRATS! Access granted  🌈";
            
            // Add green-active class to the correct answer
            if (selectedRadioInput) {
                selectedRadioInput.classList.add('green-active');
            }

            let submitBtn = document.querySelector('button[type="submit"]');

            if(submitBtn){
                submitBtn.classList.add('active');
            }
            
            // Make sure winning animation is initialized
            if (!winningAnimation) {
                initializeWinningAnimation();
            }
            
            // Show and play winning animation
            document.getElementById('winning-lottie').style.opacity = '1';
            winningAnimation.goToAndPlay(0, true);
            
            // Play win sound
            const winSoundId = sounds.win.play();
            
            // REDUCED: Wait 2.5 seconds before showing won view
            resultTimeout = setTimeout(() => {
                // Fade out win sound over 1 second before switching view
                sounds.win.fade(0.7, 0, 1000, winSoundId);
                
                // Show won view, hide quiz view using smooth transition
                switchView(quizView, wonView);
                
                // Initialize and play arrow animation immediately
                if (!arrowAnimation) {
                    initializeArrowAnimation();
                }
                arrowAnimation.goToAndPlay(0, true);
            }, 3000);
        } else {
            
            // Change speech bubble text for wrong answer
            speechBubble.textContent = "Aaaaah!!!";
            
            // Add red-error class to the selected wrong answer
            if (selectedRadioInput) {
                selectedRadioInput.classList.add('red-error');
            }
            
            // Make sure bomb animation is initialized
            if (!bombAnimation) {
                initializeBombAnimation();
            }
            
            // Show bomb animation container but delay playing the animation
            document.getElementById('bomb-lottie').style.opacity = '1';
            
            // Play bomb animation
            bombAnimation.goToAndPlay(0, true);
            
            // Play lose sound
            const loseSoundId = sounds.lose.play();
            
            // REDUCED: Wait 2 seconds before showing lose view
            resultTimeout = setTimeout(() => {
                // Fade out lose sound over 1 second before switching view
                sounds.lose.fade(0.7, 0, 1000, loseSoundId);
                
                // Show lose view, hide quiz view using smooth transition
                switchView(quizView, loseView);
            }, 2000);
        }
    });

    // Try again button functionality
    tryAgainButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Reset the form
        quizForm.reset();
        submitButton.disabled = true;
        
        // Re-enable all radio buttons
        radioFields.forEach(field => {
            field.disabled = false;
        });
        
        // Reset speech bubble to original question
        speechBubble.textContent = originalQuestion;
        
        // Show the timer again
        timerElement.style.display = '';
        
        // Clear any existing timeout
        clearTimeout(resultTimeout);
        
        // Reset radio button visual states
        radioFields.forEach(field => {
            // Reset the custom radio button visual state
            const radioInput = field.parentElement.querySelector('.w-radio-input');
            if (radioInput) {
                radioInput.classList.remove('w--redirected-checked', 'active', 'inactive', 'green-active', 'red-error');
            }
        });
        
        // Reset job card animations
        document.querySelectorAll('.job_cards-wrapper .job_c-item').forEach(card => {
            card.classList.remove('animate-in');
        });
        
        // Reset animations
        document.getElementById('15-sec-lottie').style.opacity = '0';
        document.getElementById('bomb-lottie').style.opacity = '0';
        document.getElementById('winning-lottie').style.opacity = '0';
        
        // Stop all animations
        if (timerAnimation) timerAnimation.stop();
        if (bombAnimation) bombAnimation.stop();
        if (winningAnimation) winningAnimation.stop();
        
        // Show quiz view, hide other views with transition
        switchView(loseView, quizView);
        
        // Start the timer animation and timer
        document.getElementById('15-sec-lottie').style.opacity = '1';
        if (timerAnimation) timerAnimation.goToAndPlay(0, true);
        startTimer();
        
        // Stop arrow animation if it exists
        if (arrowAnimation) {
            arrowAnimation.stop();
        }
    });

    // Add CSS for job card animations
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .job_c-item {
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.5s ease, transform 0.2s ease;
        }
        
        .job_c-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleElement);

    // Function to animate job cards with stagger
    function animateJobCards() {
        const jobCards = document.querySelectorAll('.job_cards-wrapper .job_c-item');
        
        // Make sure all cards are reset
        jobCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)'; // Increased from 10px for more visible effect
        });
        
        // Force a reflow
        void document.body.offsetHeight;
        
        // Animate each card with stagger
        jobCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.transition = 'opacity 0.6s ease, transform 0.3s ease'; // Slightly longer for smoother effect
            }, 100 * index); // Slightly faster stagger (was 200ms)
        });
        
        // Add hover effects after the last card animation starts
        setTimeout(() => {
            addJobCardHoverEffects();
        }, 100 * jobCards.length + 100); // Wait for all cards to animate plus a small buffer
    }
    
    // Improve the hover effects for job cards with smoother easing
    function addJobCardHoverEffects() {
        const jobCards = document.querySelectorAll('.job_cards-wrapper .job_c-item');
        
        jobCards.forEach(card => {
            // When mouse enters a card
            card.addEventListener('mouseenter', () => {
                // Reduce opacity of all sibling cards with smooth easing
                jobCards.forEach(siblingCard => {
                    if (siblingCard !== card) {
                        // Apply smooth transition with cubic-bezier easing
                        siblingCard.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        siblingCard.style.opacity = '0.5';
                    }
                });
                
                // Enhance the hovered card with a slight scale and elevation
                card.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'translateY(-8px) scale(1.02)';
                card.style.zIndex = '2';
            });
            
            // When mouse leaves a card
            card.addEventListener('mouseleave', () => {
                // Restore opacity of all cards with smooth easing
                jobCards.forEach(siblingCard => {
                    // Apply smooth transition with cubic-bezier easing
                    siblingCard.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    siblingCard.style.opacity = '1';
                });
                
                // Reset the previously hovered card
                card.style.transition = 'opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                card.style.transform = 'translateY(0) scale(1)';
                card.style.zIndex = '1';
            });
        });
    }

    // Add a mute button to toggle sound
    const muteButton = document.createElement('button');
    muteButton.innerHTML = '🔊';
    muteButton.style.position = 'fixed';
    muteButton.style.bottom = '20px';
    muteButton.style.right = '20px';
    muteButton.style.zIndex = '1000';
    muteButton.style.background = 'rgba(255, 255, 255, 0.7)';
    muteButton.style.border = 'none';
    muteButton.style.borderRadius = '50%';
    muteButton.style.width = '40px';
    muteButton.style.height = '40px';
    muteButton.style.fontSize = '20px';
    muteButton.style.cursor = 'pointer';
    muteButton.style.display = 'flex';
    muteButton.style.alignItems = 'center';
    muteButton.style.justifyContent = 'center';
    muteButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    muteButton.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        muteButton.innerHTML = soundEnabled ? '🔊' : '🔇';
        
        // Stop all currently playing sounds if muted
        if (!soundEnabled) {
            Object.values(sounds).forEach(sound => {
                sound.stop();
            });
        }
    });
    
    document.body.appendChild(muteButton);
    
    // Initialize and play arrow animation for won view
    let arrowAnimation;

    function initializeArrowAnimation() {
        // Check if animation already exists
        if (arrowAnimation) {
            return arrowAnimation;
        }
        
        // Create new animation
        arrowAnimation = lottie.loadAnimation({
            container: document.getElementById('arrow-lottie'),
            renderer: 'svg',
            loop: false, // Changed from true to false to play only once
            autoplay: false,
            path: 'https://files.tryflowdrive.com/org-2f3e4c92-20d9-49d2-be8f-0f3b4d5e98d1/file-171d7560-f6d2-4753-9265-6995f6886e03_clipt-arrow-black.json'
        });
        
        // Add completion event to trigger job card animation when arrow animation finishes
        arrowAnimation.addEventListener('complete', function() {
            // Animate job cards immediately after arrow animation completes
            animateJobCards();
        });
        
        return arrowAnimation;
    }

    // Add click sound to all buttons and links
    function addClickSoundToElements() {
        // Select all buttons and links
        const clickableElements = document.querySelectorAll('button, a, .button');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', function(e) {
                // Don't play click sound for radio buttons as they already have their own sound
                if (!this.closest('.option-item')) {
                    playSound('click');
                }
                
                // Don't prevent default - let the normal click behavior happen
            });
        });
        
        
    }
    
    // Call the function to add click sounds
    addClickSoundToElements();
    
    // For dynamically added elements, we can use a mutation observer
    // This is optional but helps if elements are added after page load
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes are buttons or links
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Only process element nodes
                        if (node.matches('button, a, .button')) {
                            node.addEventListener('click', function() {
                                if (!this.closest('.option-item')) {
                                    playSound('click');
                                }
                            });
                        }
                        
                        // Also check children of added nodes
                        const clickableChildren = node.querySelectorAll('button, a, .button');
                        clickableChildren.forEach(element => {
                            element.addEventListener('click', function() {
                                if (!this.closest('.option-item')) {
                                    playSound('click');
                                }
                            });
                        });
                    }
                });
            }
        });
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
});
