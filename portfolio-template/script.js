// Portfolio Interactive Features
class PortfolioApp {
    constructor() {
        this.currentSection = 'about';
        this.isAnimating = false;
        this.isMuted = false;
        this.isUFOMuted = false;
        this.soundsEnabled = false; // Prevent sounds until start button is pressed
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = this.createAllSounds();
        this.init();
    }

    init() {
        this.setupSplashScreen();
        this.createStars();
        this.setupNavigation();
        this.setupAnimations();
        this.setupProjectFilters();
        this.setupSkillAnimations();
        this.setupContactForm();
        // Counter animations will be started after splash screen is dismissed
        this.setupScrollEffects();
        this.setupButtonEffects();
        this.setupGlobalSoundEffects();
        this.setupExperienceInteractions();
        this.setupTimelineAnimations();
        this.setupPlanetInteractions();
        this.setupContactInteractions();
        this.setupMuteButton();
        this.setupPerformanceMonitoring(); // Add performance monitoring
        // NOTE: Shooting stars were removed due to animation issues - they were supposed to spawn from random edges and move across the screen
        // Distant UFOs will be started after splash screen is dismissed
        // Typing effect will be started after splash screen is dismissed
    }

    // Setup splash screen functionality
    setupSplashScreen() {
        const startButton = document.getElementById('startButton');
        const splashScreen = document.getElementById('splashScreen');
        const container = document.querySelector('.container');

        if (startButton && splashScreen && container) {
            startButton.addEventListener('click', () => {
                // Enable sounds when start button is pressed
                this.soundsEnabled = true;
                
                // Play start sound
                this.sounds.buttonClick();
                
                // Fade out splash screen
                splashScreen.classList.add('fade-out');
                
                // Show main content
                container.classList.add('show');
                
                // Start typing effect and counter animations after splash screen fades
                setTimeout(() => {
                    this.setupEnhancedTypingEffect();
                    this.setupCounterAnimations();
                    this.setupDistantUFOs(); // Start UFOs after splash screen is dismissed
                }, 800);
                
                // Remove splash screen after animation
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                }, 800);
            });
        }
    }

    // Create all sound effects for the portfolio
    createAllSounds() {
        return {
            // Typing sounds
            type: () => this.createTone(800, 600, 0.015, 0.05),
            space: () => this.createTone(400, 300, 0.01, 0.1),
            punctuation: () => this.createTone(1000, 800, 0.02, 0.08),
            
            // Navigation sounds
            navHover: () => this.createTone(600, 500, 0.01, 0.1),
            navClick: () => this.createTone(800, 600, 0.015, 0.15),
            sectionChange: () => this.createTone(400, 300, 0.025, 0.3),
            
            // Button sounds
            buttonHover: () => this.createTone(500, 400, 0.008, 0.08),
            buttonClick: () => this.createTone(700, 500, 0.012, 0.12),
            buttonSuccess: () => this.createSuccessSound(),
            
            // Counter sounds
            counterTick: () => this.createTone(300, 250, 0.008, 0.05),
            counterComplete: () => this.createTone(600, 400, 0.02, 0.2),
            
            // Skill sounds
            skillHover: () => this.createTone(450, 350, 0.008, 0.06),
            skillFill: () => this.createTone(350, 300, 0.01, 0.1),
            
            // Project sounds
            projectHover: () => this.createTone(550, 450, 0.008, 0.07),
            filterClick: () => this.createTone(650, 550, 0.01, 0.1),
            
            // Form sounds
            inputFocus: () => this.createTone(400, 350, 0.008, 0.05),
            formSubmit: () => this.createTone(500, 400, 0.015, 0.2),
            
            // Star sounds
            starTwinkle: () => this.createTone(800, 600, 0.005, 0.1),
            
            // Loading sounds
            loadingTick: () => this.createTone(200, 150, 0.005, 0.03),
            loadingComplete: () => this.createTone(800, 600, 0.025, 0.4),
            
            // UFO Invasion sounds
            ufoEngine: () => this.createTone(200, 150, 0.008, 0.2),
            ufoBeam: () => this.createTone(800, 600, 0.01, 0.3),
            ufoPass: () => this.createTone(400, 300, 0.015, 0.5),
            earthRotate: () => this.createTone(100, 80, 0.005, 0.1),
            
            // Planet sounds
            planetHover: () => this.createTone(300, 250, 0.01, 0.2),
            planetRotate: () => this.createTone(150, 120, 0.008, 0.15),
            saturnRings: () => this.createTone(400, 350, 0.008, 0.3),
            
            // Experience sounds
            timelineHover: () => this.createTone(450, 350, 0.008, 0.1),
            timelineClick: () => this.createTone(600, 500, 0.012, 0.15),
            statCardHover: () => this.createTone(350, 300, 0.006, 0.08),
            achievementHover: () => this.createTone(500, 400, 0.008, 0.1),
            
            // Contact sounds
            contactHover: () => this.createTone(400, 300, 0.006, 0.08),
            copyClick: () => this.createTone(600, 500, 0.01, 0.12),
            inputFocus: () => this.createTone(350, 300, 0.005, 0.06),
            formSubmit: () => this.createTone(500, 400, 0.012, 0.2)
        };
    }

    // Create dummy sounds for low-end devices
    createDummySounds() {
        const dummySound = () => {}; // No-op function
        return {
            type: dummySound,
            space: dummySound,
            punctuation: dummySound,
            navHover: dummySound,
            navClick: dummySound,
            sectionChange: dummySound,
            buttonHover: dummySound,
            buttonClick: dummySound,
            buttonSuccess: dummySound,
            counterTick: dummySound,
            counterComplete: dummySound,
            skillHover: dummySound,
            skillFill: dummySound,
            projectHover: dummySound,
            filterClick: dummySound,
            ufoSound: dummySound,
            achievementUnlock: dummySound,
            timelineProgress: dummySound,
            contactHover: dummySound,
            contactSuccess: dummySound,
            planetHover: dummySound,
            starTwinkle: dummySound,
            formSubmit: dummySound,
            formSuccess: dummySound,
            formError: dummySound,
            muteToggle: dummySound
        };
    }

    // Performance monitoring system
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        let fps = 60;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                // Dynamically adjust effects based on FPS
                this.adjustEffectsForPerformance(fps);
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    // Dynamically adjust effects based on performance
    adjustEffectsForPerformance(fps) {
        const ufoFleet = document.querySelector('.ufo-fleet');
        const planets = document.querySelectorAll('.planet');
        const starClusters = document.querySelectorAll('.star-cluster');
        
        if (fps < 30) {
            // Low FPS - reduce heavy effects
            if (ufoFleet) ufoFleet.style.opacity = '0.3';
            planets.forEach(planet => planet.style.animationPlayState = 'paused');
            starClusters.forEach(cluster => cluster.style.animationPlayState = 'paused');
        } else if (fps < 45) {
            // Medium FPS - moderate effects
            if (ufoFleet) ufoFleet.style.opacity = '0.6';
            planets.forEach(planet => planet.style.animationDuration = '10s');
            starClusters.forEach(cluster => cluster.style.animationDuration = '8s');
        } else {
            // High FPS - full effects
            if (ufoFleet) ufoFleet.style.opacity = '1';
            planets.forEach(planet => planet.style.animationPlayState = 'running');
            starClusters.forEach(cluster => cluster.style.animationPlayState = 'running');
        }
    }

    // Create invasion sound (descending ominous tone)
    createInvasionSound() {
        const frequencies = [600, 500, 400, 300, 200];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, freq * 0.8, 0.05, 0.3);
            }, index * 200);
        });
    }

    // Create a tone with specified parameters
    createTone(startFreq, endFreq, volume, duration) {
        if (this.isMuted || !this.soundsEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create enhanced UFO sounds with different characteristics
    createUFOSound(type) {
        if (this.isUFOMuted) return;
        
        switch(type) {
            case 'engine':
                // Low rumble with pulsing effect
                this.createUFORumble(150, 100, 0.0045, 0.8); // Reduced from 0.015 to 0.0045 (30%)
                break;
            case 'beam':
                // High-pitched scanning beam with modulation
                this.createUFOBeam(1200, 800, 0.006, 0.6); // Reduced from 0.02 to 0.006 (30%)
                break;
            case 'pass':
                // Doppler effect sound as UFO passes by
                this.createUFOPass(600, 200, 0.0075, 1.2); // Reduced from 0.025 to 0.0075 (30%)
                break;
            case 'scan':
                // Electronic scanning sound with frequency sweep
                this.createUFOScan(800, 400, 0.0054, 0.9); // Reduced from 0.018 to 0.0054 (30%)
                break;
            case 'hover':
                // Gentle hovering sound with subtle modulation
                this.createUFOHover(300, 250, 0.0036, 0.5); // Reduced from 0.012 to 0.0036 (30%)
                break;
            case 'formation':
                // Formation change sound with multiple tones
                this.createUFOFormation();
                break;
        }
    }

    // Create UFO engine rumble
    createUFORumble(baseFreq, endFreq, volume, duration) {
        if (this.isUFOMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Set up low-pass filter for rumble effect
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
        filter.Q.setValueAtTime(2, this.audioContext.currentTime);
        
        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        // Add pulsing effect
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
        
        // Create pulsing effect
        for (let i = 0; i < duration * 10; i++) {
            setTimeout(() => {
                gainNode.gain.setValueAtTime(volume * (0.3 + 0.7 * Math.sin(i * 0.5)), this.audioContext.currentTime);
            }, i * 100);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create UFO beam sound
    createUFOBeam(startFreq, endFreq, volume, duration) {
        if (this.isUFOMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Set up band-pass filter for beam effect
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        filter.Q.setValueAtTime(5, this.audioContext.currentTime);
        
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        // Add modulation effect
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.05);
        
        // Create scanning modulation
        for (let i = 0; i < duration * 20; i++) {
            setTimeout(() => {
                gainNode.gain.setValueAtTime(volume * (0.4 + 0.6 * Math.sin(i * 0.3)), this.audioContext.currentTime);
            }, i * 50);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create UFO pass sound with Doppler effect
    createUFOPass(startFreq, endFreq, volume, duration) {
        if (this.isUFOMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        // Doppler effect - volume increases then decreases
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + duration * 0.3);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create UFO scan sound
    createUFOScan(startFreq, endFreq, volume, duration) {
        if (this.isUFOMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Frequency sweep for scanning effect
        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration * 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(startFreq, this.audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create UFO hover sound
    createUFOHover(baseFreq, endFreq, volume, duration) {
        if (this.isUFOMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
        
        // Gentle hovering effect
        gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);
        
        // Subtle modulation for hovering effect
        for (let i = 0; i < duration * 8; i++) {
            setTimeout(() => {
                gainNode.gain.setValueAtTime(volume * (0.2 + 0.1 * Math.sin(i * 0.2)), this.audioContext.currentTime);
            }, i * 125);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Create UFO formation sound
    createUFOFormation() {
        if (this.isUFOMuted) return;
        
        const frequencies = [400, 500, 600, 700];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, freq * 0.9, 0.006, 0.4); // Reduced from 0.02 to 0.006 (30%)
            }, index * 100);
        });
    }

    // Setup mute button functionality
    setupMuteButton() {
        const muteButton = document.getElementById('muteButton');
        if (!muteButton) return;

        // Load mute state from localStorage
        const savedMuteState = localStorage.getItem('ufoSoundMuted');
        if (savedMuteState === 'true') {
            this.isUFOMuted = true;
            muteButton.setAttribute('data-muted', 'true');
            muteButton.querySelector('.mute-text').textContent = 'UFO SOUND OFF';
        } else {
            muteButton.querySelector('.mute-text').textContent = 'UFO SOUND ON';
        }

        muteButton.addEventListener('click', () => {
            this.toggleUFOMute();
        });
    }

    // Toggle UFO mute state
    toggleUFOMute() {
        const muteButton = document.getElementById('muteButton');
        if (!muteButton) return;

        this.isUFOMuted = !this.isUFOMuted;
        
        if (this.isUFOMuted) {
            muteButton.setAttribute('data-muted', 'true');
            muteButton.querySelector('.mute-text').textContent = 'UFO SOUND OFF';
            localStorage.setItem('ufoSoundMuted', 'true');
        } else {
            muteButton.setAttribute('data-muted', 'false');
            muteButton.querySelector('.mute-text').textContent = 'UFO SOUND ON';
            localStorage.setItem('ufoSoundMuted', 'false');
        }

        // Add press animation
        muteButton.classList.add('pressed');
        setTimeout(() => {
            muteButton.classList.remove('pressed');
        }, 200);
    }

    // Create success sound (ascending chord)
    createSuccessSound() {
        const frequencies = [400, 500, 600, 700];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createTone(freq, freq * 1.2, 0.015, 0.2);
            }, index * 50);
        });
    }

    // Setup global sound effects
    setupGlobalSoundEffects() {
        // Enable audio context on first user interaction
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });

        // Add sound to star twinkling
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.sounds.starTwinkle();
            }
        }, 2000);
        
        // Setup UFO invasion effects
        this.setupUFOInvasion();
    }

    // Setup UFO invasion effects
    setupUFOInvasion() {
        const ufos = document.querySelectorAll('.ufo');
        const earth = document.querySelector('.earth-pixels');
        const alert = document.querySelector('.invasion-alert');
        
        // UFO engine sounds
        ufos.forEach((ufo, index) => {
            setInterval(() => {
                this.sounds.ufoEngine();
            }, 3000 + (index * 500)); // Staggered engine sounds
        });
        
        // UFO beam sounds
        ufos.forEach((ufo, index) => {
            setInterval(() => {
                this.sounds.ufoBeam();
            }, 4000 + (index * 700)); // Staggered beam sounds
        });
        
        // UFO pass sounds when they cross the screen
        ufos.forEach((ufo, index) => {
            setInterval(() => {
                this.sounds.ufoPass();
            }, 8000 + (index * 1000)); // Staggered pass sounds
        });
        
        // Earth rotation sound
        if (earth) {
            setInterval(() => {
                this.sounds.earthRotate();
            }, 2000);
        }
        
                    // Planet rotation sounds
            const planets = document.querySelectorAll('.planet');
            planets.forEach((planet, index) => {
                setInterval(() => {
                    this.sounds.planetRotate();
                }, 8000 + (index * 1000)); // Staggered planet sounds
            });
        
        // Create additional UFO effects
        this.createUFOEffects();
        
        // Setup planet interactions
        this.setupPlanetInteractions();
    }

    // Create additional UFO effects
    createUFOEffects() {
        // Create UFO trails
        const ufos = document.querySelectorAll('.ufo');
        ufos.forEach(ufo => {
            this.createUFOTrail(ufo);
        });
        
        // Create random UFO spawns
        setInterval(() => {
            this.spawnRandomUFO();
        }, 15000); // Spawn new UFO every 15 seconds
        
        // Create Earth atmosphere effects
        this.createEarthAtmosphere();
    }

    // Create UFO trail effect
    createUFOTrail(ufo) {
        const trail = document.createElement('div');
        trail.className = 'ufo-trail';
        trail.style.cssText = `
            position: absolute;
            width: 2px;
            height: 20px;
            background: linear-gradient(to bottom, rgba(76, 175, 80, 0.8), transparent);
            border-radius: 1px;
            pointer-events: none;
            z-index: 0;
            animation: trailFade 2s ease-out forwards;
        `;
        
        // Position trail behind UFO
        const rect = ufo.getBoundingClientRect();
        trail.style.left = (rect.left + rect.width / 2) + 'px';
        trail.style.top = (rect.top + rect.height) + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 2000);
    }

    // Spawn random UFO
    spawnRandomUFO() {
        const ufo = document.createElement('div');
        ufo.className = 'ufo random-ufo';
        ufo.style.cssText = `
            position: fixed;
            width: 25px;
            height: 12px;
            background: radial-gradient(ellipse at center, #4caf50 0%, #4caf50 40%, #2e7d32 40%, #2e7d32 60%, #1b5e20 60%);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
            z-index: 1;
            pointer-events: none;
            animation: randomUFOFlight 12s linear forwards;
        `;
        
        // Random starting position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        ufo.style.left = startX + 'px';
        ufo.style.top = startY + 'px';
        
        document.body.appendChild(ufo);
        
        // Add beam effect
        const beam = document.createElement('div');
        beam.className = 'ufo-beam';
        beam.style.cssText = `
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            width: 3px;
            height: 30px;
            background: linear-gradient(to bottom, rgba(33, 150, 243, 0.6), transparent);
            border-radius: 1.5px;
            animation: beamScan 2s ease-in-out infinite;
        `;
        ufo.appendChild(beam);
        
        // Play UFO sound
        this.sounds.ufoEngine();
        
        // Remove UFO after animation
        setTimeout(() => {
            ufo.remove();
        }, 12000);
    }

    // Create Earth atmosphere effects
    createEarthAtmosphere() {
        const earth = document.querySelector('.earth-pixels');
        if (!earth) return;
        
        // Create atmosphere particles
        setInterval(() => {
            this.createAtmosphereParticle(earth);
        }, 3000);
    }

    // Create atmosphere particle
    createAtmosphereParticle(earth) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(74, 144, 226, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            animation: atmosphereFloat 4s ease-out forwards;
        `;
        
        const rect = earth.getBoundingClientRect();
        const angle = Math.random() * Math.PI * 2;
        const distance = 60 + Math.random() * 20;
        
        particle.style.left = (rect.left + rect.width / 2 + Math.cos(angle) * distance) + 'px';
        particle.style.top = (rect.top + rect.height / 2 + Math.sin(angle) * distance) + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 4000);
    }

    // Setup planet interactions
    setupPlanetInteractions() {
        const planets = document.querySelectorAll('.planet');
        
        planets.forEach(planet => {
            // Planet hover sound
            planet.addEventListener('mouseenter', () => {
                this.sounds.planetHover();
                this.createPlanetEffect(planet);
            });
            
            // Planet rotation sound
            planet.addEventListener('click', () => {
                this.sounds.planetRotate();
                this.createPlanetPulse(planet);
            });
            
            // Special sound for Saturn rings
            if (planet.classList.contains('saturn')) {
                const rings = planet.querySelector('.saturn-rings');
                if (rings) {
                    rings.addEventListener('mouseenter', () => {
                        this.sounds.saturnRings();
                    });
                }
            }
        });
        
        // Create planet atmosphere effects
        this.createPlanetAtmospheres();
    }

    // Create planet effect
    createPlanetEffect(planet) {
        // Create particle burst around planet
        const rect = planet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                animation: planetParticle 1s ease-out forwards;
            `;
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // Create planet pulse effect
    createPlanetPulse(planet) {
        planet.style.animation = 'planetPulse 0.5s ease-out';
        setTimeout(() => {
            planet.style.animation = '';
        }, 500);
    }

    // Create planet atmospheres
    createPlanetAtmospheres() {
        const planets = document.querySelectorAll('.planet');
        
        planets.forEach(planet => {
            setInterval(() => {
                this.createAtmosphereParticle(planet);
            }, 5000 + Math.random() * 5000); // Random intervals
        });
    }

    // Create atmosphere particle for planets
    createAtmosphereParticle(planet) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: planetAtmosphereFloat 3s ease-out forwards;
        `;
        
        const rect = planet.getBoundingClientRect();
        const angle = Math.random() * Math.PI * 2;
        const distance = rect.width / 2 + 10 + Math.random() * 20;
        
        particle.style.left = (rect.left + rect.width / 2 + Math.cos(angle) * distance) + 'px';
        particle.style.top = (rect.top + rect.height / 2 + Math.sin(angle) * distance) + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    // Create typing sound effects
    createTypingAudio() {
        return {
            type: () => this.sounds.type(),
            space: () => this.sounds.space(),
            punctuation: () => this.sounds.punctuation()
        };
    }

    // Setup enhanced typing effect
    setupEnhancedTypingEffect() {
        const typingText = document.querySelector('.enhanced-typing-text');
        if (!typingText) return;
        
        const originalText = typingText.textContent;
        typingText.textContent = '';
        typingText.classList.add('cursor-active', 'typing-started');
        
        // Keywords to highlight
        const keywords = ['developer', 'awesome', 'interactive', 'innovative', 'solutions'];
        const punctuation = ['.', ',', '!', '?', ':', ';'];
        
        let currentIndex = 0;
        let currentLine = '';
        const lines = [];
        
        // Split text into lines for better presentation
        const words = originalText.split(' ');
        let line = '';
        
        words.forEach(word => {
            if ((line + word).length > 60) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line += word + ' ';
            }
        });
        lines.push(line.trim());
        
        const typeNextCharacter = () => {
            if (currentIndex >= originalText.length) {
                // Typing complete
                setTimeout(() => {
                    typingText.classList.remove('cursor-active');
                    typingText.classList.add('typing-complete');
                    this.sounds.loadingComplete();
                }, 1000);
                return;
            }
            
            const char = originalText[currentIndex];
            
            // Check if this character is part of a keyword
            const currentWord = this.getCurrentWord(originalText, currentIndex);
            const isKeyword = keywords.some(keyword => currentWord.toLowerCase().includes(keyword.toLowerCase()));
            
            // Create a span for the character with proper word handling
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.className = 'char';
            
            // Add special classes for different character types
            if (punctuation.includes(char)) {
                charSpan.classList.add('punctuation');
                this.sounds.punctuation();
            } else if (char === ' ') {
                charSpan.classList.add('space');
                this.sounds.space();
            } else {
                this.sounds.type();
            }
            
            // Add keyword class if applicable
            if (isKeyword) {
                charSpan.classList.add('keyword');
            }
            
            typingText.appendChild(charSpan);
            
            // Add typing glow effect
            typingText.classList.add('typing');
            setTimeout(() => {
                typingText.classList.remove('typing');
            }, 100);
            
            currentIndex++;
            
            // Variable typing speed
            let delay = 50; // Base delay
            
            // Slower for punctuation
            if (punctuation.includes(char)) {
                delay = 200;
            }
            // Faster for spaces
            else if (char === ' ') {
                delay = 30;
            }
            // Random variation for natural feel
            else {
                delay += Math.random() * 30 - 15;
            }
            
            // Pause at sentence endings
            if (char === '.' || char === '!') {
                delay = 500;
            }
            
            setTimeout(typeNextCharacter, delay);
        };
        
        // Start typing immediately
        typeNextCharacter();
    }
    
    // Helper function to get current word
    getCurrentWord(text, index) {
        let start = index;
        let end = index;
        
        // Find word start
        while (start > 0 && /\w/.test(text[start - 1])) {
            start--;
        }
        
        // Find word end
        while (end < text.length && /\w/.test(text[end])) {
            end++;
        }
        
        return text.substring(start, end);
    }

    // Create animated starfield background
    createStars() {
        const body = document.body;
        const numberOfStars = 100;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay and duration
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${1 + Math.random() * 2}s`;
            
            body.appendChild(star);
        }
    }

    // Interactive star movement with mouse
    moveStars(e) {
        const stars = document.querySelectorAll('.star');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        stars.forEach((star, index) => {
            const speed = (index % 3 + 1) * 0.3;
            const x = mouseX * 20 * speed;
            const y = mouseY * 20 * speed;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // Setup navigation with smooth transitions
    setupNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.sounds.navClick();
                const targetSection = item.getAttribute('data-section');
                this.navigateToSection(targetSection);
            });

            // Fix hover selection - ensure correct item is highlighted
            item.addEventListener('mouseenter', () => {
                this.sounds.navHover();
                // Remove active class from all items
                menuItems.forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                
                // Add active class to hovered item
                item.classList.add('active');
            });

            item.addEventListener('mouseleave', () => {
                // Only remove active if it's not the current section
                if (item.getAttribute('data-section') !== this.currentSection) {
                    item.classList.remove('active');
                }
                
                // Restore active class to current section
                const currentMenuItem = document.querySelector(`[data-section="${this.currentSection}"]`);
                if (currentMenuItem) {
                    currentMenuItem.classList.add('active');
                }
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            const sections = ['about', 'projects', 'skills', 'experience', 'contact'];
            const currentIndex = sections.indexOf(this.currentSection);
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    const nextIndex = (currentIndex + 1) % sections.length;
                    this.navigateToSection(sections[nextIndex]);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
                    this.navigateToSection(sections[prevIndex]);
                    break;
            }
        });
    }

    navigateToSection(sectionName) {
        if (this.isAnimating || this.currentSection === sectionName) return;
        
        this.isAnimating = true;
        this.sounds.sectionChange();
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Hide current section
        const currentSection = document.querySelector(`#${this.currentSection}`);
        currentSection.style.animation = 'fadeOut 0.3s ease-out forwards';
        
        setTimeout(() => {
            currentSection.classList.remove('active');
            currentSection.style.animation = '';
            
            // Show new section
            const newSection = document.querySelector(`#${sectionName}`);
            newSection.classList.add('active');
            
            this.currentSection = sectionName;
            
            // Trigger section-specific animations
            this.triggerSectionAnimations(sectionName);
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }, 300);
    }

    triggerSectionAnimations(sectionName) {
        switch(sectionName) {
            case 'about':
                this.animateCounters();
                break;
            case 'skills':
                this.animateSkillBars();
                break;
            case 'projects':
                this.animateProjectCards();
                break;
        }
    }

    // Animate counters in stats
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    this.sounds.counterComplete();
                    counter.classList.remove('counting');
                    
                    // Add completion effect
                    this.createCompletionEffect(counter);
                } else {
                    this.sounds.counterTick();
                    counter.classList.add('counting');
                }
                counter.textContent = Math.floor(current);
            }, 16);
        };
        
        // Observe when counters come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
        
        // Setup stats interactions
        this.setupStatsInteractions();
    }

    // Create completion effect for counters
    createCompletionEffect(counter) {
        const statItem = counter.closest('.stat-item');
        if (!statItem) return;
        
        // Create sparkle effect
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createSparkle(statItem);
            }, i * 100);
        }
        
        // Add pulse effect
        statItem.style.animation = 'statCompletion 0.5s ease-out';
        setTimeout(() => {
            statItem.style.animation = '';
        }, 500);
    }

    // Create sparkle effect
    createSparkle(statItem) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-green);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: sparkleEffect 1s ease-out forwards;
        `;
        
        // Random position around the stat item
        const rect = statItem.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        statItem.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // Setup stats interactions
    setupStatsInteractions() {
        const statItems = document.querySelectorAll('.stat-item');
        const statsContainer = document.querySelector('.stats-container');
        
        if (!statsContainer) return;
        
        // Create floating particles
        this.createFloatingParticles(statsContainer);
        
        // Add click effects to stat items
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                this.sounds.buttonClick();
                this.createRippleEffect(item);
                this.animateStatItem(item);
            });
            
            // Add hover sound
            item.addEventListener('mouseenter', () => {
                this.sounds.buttonHover();
            });
        });
    }

    // Create floating particles around stats
    createFloatingParticles(container) {
        const particleCount = 6;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--primary-green);
                border-radius: 50%;
                pointer-events: none;
                animation: float 3s ease-in-out infinite;
                animation-delay: ${i * 0.5}s;
                left: ${20 + (i * 15)}%;
                top: ${30 + (i % 2 * 40)}%;
            `;
            
            container.appendChild(particle);
        }
    }

    // Create ripple effect
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(123, 255, 0, 0.3);
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 5;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Animate stat item
    animateStatItem(item) {
        // Add bounce effect
        item.style.animation = 'statBounce 0.5s ease-out';
        setTimeout(() => {
            item.style.animation = '';
        }, 500);
        
        // Create particle burst
        this.createParticleBurst(item);
    }

    // Create particle burst
    createParticleBurst(element) {
        const particleCount = 12;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: var(--primary-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
                animation: particleBurst 1s ease-out forwards;
            `;
            
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const endX = centerX + Math.cos(angle) * distance;
            const endY = centerY + Math.sin(angle) * distance;
            
            particle.style.setProperty('--end-x', endX + 'px');
            particle.style.setProperty('--end-y', endY + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // Setup project filters
    setupProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.sounds.filterClick();
                const filter = btn.getAttribute('data-filter');
                
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects with enhanced animation
                projectCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Animate project cards
    animateProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    // Setup skill animations
    setupSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                this.sounds.skillHover();
                // Simple click effect
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            });
        });
    }

    // Animate skill bars
    animateSkillBars() {
        const skillFills = document.querySelectorAll('.skill-fill');
        
        skillFills.forEach((fill, index) => {
            const level = fill.getAttribute('data-level');
            fill.style.width = '0%';
            
            setTimeout(() => {
                fill.style.width = level + '%';
                this.sounds.skillFill();
            }, index * 200);
        });
    }

    // Setup contact form
    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        // Initialize EmailJS
        emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your actual EmailJS public key
        
        // Add sound to input focus
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.sounds.inputFocus();
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.sounds.formSubmit();
            
            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name') || document.getElementById('name').value;
            const email = formData.get('email') || document.getElementById('email').value;
            const message = formData.get('message') || document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                this.showNotification('Please fill in all fields!', 'error');
                return;
            }
            
            // Add loading state
            const submitBtn = form.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send email using EmailJS
                const response = await emailjs.send(
                    'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                    {
                        from_name: name,
                        from_email: email,
                        message: message,
                        to_name: 'Your Name', // Replace with your name
                        reply_to: email
                    }
                );
                
                // Success
                btnText.textContent = 'Message Sent!';
                submitBtn.style.background = 'var(--primary-green)';
                this.sounds.buttonSuccess();
                this.showNotification('Message sent successfully! 🚀', 'success');
                
                // Reset form
                setTimeout(() => {
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    form.reset();
                }, 2000);
                
            } catch (error) {
                // Error handling
                console.error('Email send failed:', error);
                btnText.textContent = 'Send Failed';
                submitBtn.style.background = '#ff4444';
                this.showNotification('Failed to send message. Please try again!', 'error');
                
                setTimeout(() => {
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 2000);
            }
        });
    }

    // Setup scroll effects
    setupScrollEffects() {
        let lastScrollTime = 0;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrolled / maxScroll) * 100;
            
            // Update loading bar based on scroll
            const loadingProgress = document.querySelector('.loading-progress');
            if (loadingProgress) {
                loadingProgress.style.width = scrollPercent + '%';
                
                // Play sound occasionally during scroll
                const now = Date.now();
                if (now - lastScrollTime > 100) { // Limit sound frequency
                    this.sounds.loadingTick();
                    lastScrollTime = now;
                }
            }
        });
    }

    // Setup general animations
    setupAnimations() {
        // Add fade-in animations to elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        });
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
        
        // Add mouse move effect
        document.addEventListener('mousemove', (e) => {
            this.moveStars(e);
        });
    }

    // Setup button effects
    setupButtonEffects() {
        const buttons = document.querySelectorAll('button, .project-link, .skill-item, .submit-btn, .filter-btn');
        
        buttons.forEach(button => {
            // Simple hover effect
            button.addEventListener('mouseenter', () => {
                this.sounds.buttonHover();
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
            
            // Simple click effect
            button.addEventListener('click', (e) => {
                this.sounds.buttonClick();
                button.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }

    // Animate counters
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    this.sounds.counterComplete();
                } else {
                    this.sounds.counterTick();
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Setup experience interactions
    setupExperienceInteractions() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const statCards = document.querySelectorAll('.stat-card');
        const achievementTags = document.querySelectorAll('.achievement-tag');

        // Timeline item interactions
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.sounds.timelineHover();
                this.createTimelineEffect(item);
            });

            item.addEventListener('click', () => {
                this.sounds.timelineClick();
                this.createTimelinePulse(item);
            });
        });

        // Stat card interactions
        statCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.sounds.statCardHover();
                this.createStatCardEffect(card);
            });
        });

        // Achievement tag interactions
        achievementTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.sounds.achievementHover();
                this.createAchievementEffect(tag);
            });
        });
    }

    // Setup timeline animations
    setupTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Create intersection observer for timeline items
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${entry.target.dataset.year - 2019} * 0.2s`;
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Create timeline effect
    createTimelineEffect(item) {
        const glow = item.querySelector('.timeline-glow');
        if (glow) {
            glow.style.animation = 'timelineGlow 0.5s ease-in-out';
            setTimeout(() => {
                glow.style.animation = 'timelineGlow 2s ease-in-out infinite';
            }, 500);
        }
    }

    // Create timeline pulse effect
    createTimelinePulse(item) {
        const dot = item.querySelector('.timeline-dot');
        if (dot) {
            dot.style.animation = 'timelinePulse 0.3s ease-in-out';
            setTimeout(() => {
                dot.style.animation = 'timelinePulse 3s ease-in-out infinite';
            }, 300);
        }
    }

    // Create stat card effect
    createStatCardEffect(card) {
        const particles = this.createParticles(card, 5);
        particles.forEach(particle => {
            setTimeout(() => {
                particle.remove();
            }, 1000);
        });
    }

    // Create achievement effect
    createAchievementEffect(tag) {
        tag.style.transform = 'scale(1.1) rotate(2deg)';
        setTimeout(() => {
            tag.style.transform = '';
        }, 200);
    }

    // Create particles for effects
    createParticles(element, count) {
        const particles = [];
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 4px;
                height: 4px;
                background: var(--primary-green);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particleFloat 1s ease-out forwards;
            `;
            
            const angle = (i / count) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--x', x + 'px');
            particle.style.setProperty('--y', y + 'px');
            
            document.body.appendChild(particle);
            particles.push(particle);
        }
        
        return particles;
    }

    // Setup contact interactions
    setupContactInteractions() {
        const contactItems = document.querySelectorAll('.contact-item');
        const copyButtons = document.querySelectorAll('.copy-btn');
        const formInputs = document.querySelectorAll('.input-container input, .input-container textarea');
        const submitBtn = document.querySelector('.submit-btn');
        const contactForm = document.querySelector('.contact-form');

        // Contact item interactions
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.sounds.contactHover();
                this.createContactEffect(item);
            });
        });

        // Copy button interactions
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.sounds.copyClick();
                this.copyToClipboard(btn.dataset.clipboard);
                this.createCopyEffect(btn);
            });
        });

        // Form input interactions
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                this.sounds.inputFocus();
                this.createInputFocusEffect(input);
            });
        });

        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sounds.formSubmit();
                this.handleFormSubmission();
            });
        }

        // Submit button interactions
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => {
                this.sounds.contactHover();
            });
        }
    }

    // Create contact effect
    createContactEffect(item) {
        const iconContainer = item.querySelector('.contact-icon-container');
        if (iconContainer) {
            iconContainer.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                iconContainer.style.transform = '';
            }, 300);
        }
    }

    // Create copy effect
    createCopyEffect(btn) {
        btn.style.transform = 'scale(1.2)';
        btn.textContent = '✅';
        setTimeout(() => {
            btn.style.transform = '';
            btn.textContent = '📋';
        }, 1000);
    }

    // Create input focus effect
    createInputFocusEffect(input) {
        const container = input.closest('.input-container');
        if (container) {
            container.style.transform = 'scale(1.02)';
            setTimeout(() => {
                container.style.transform = '';
            }, 200);
        }
    }

    // Copy to clipboard
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                this.showNotification('Failed to copy', 'error');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                this.showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                this.showNotification('Failed to copy', 'error');
            }
            document.body.removeChild(textArea);
        }
    }

    // Handle form submission
    handleFormSubmission() {
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        if (!name || !email || !message) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span><span class="btn-icon">📤</span>';
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            this.showNotification('Message sent successfully!', 'success');
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span><span class="btn-icon">✅</span>';
                setTimeout(() => {
                    submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon">🚀</span>';
                    submitBtn.disabled = false;
                }, 2000);
            }
            // Reset form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('message').value = '';
        }, 2000);
    }

    // Show notification
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--primary-green)' : '#ff4444'};
            color: ${type === 'success' ? '#ffffff' : '#ffffff'};
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: bold;
            border: 2px solid var(--secondary-green);
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    
    // Add some fun easter eggs
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg: Change all colors to rainbow
            document.documentElement.style.setProperty('--primary-green', '#ff0000');
            document.documentElement.style.setProperty('--secondary-green', '#00ff00');
            setTimeout(() => {
                document.documentElement.style.setProperty('--primary-green', '#7bff00');
                document.documentElement.style.setProperty('--secondary-green', '#9fff00');
            }, 3000);
            konamiCode = [];
        }
    });
});

// Add CSS for fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes skillFill {
        0% { transform: scaleX(0); }
        50% { transform: scaleX(1.1); }
        100% { transform: scaleX(1); }
    }
    
    /* Typing complete state */
    .enhanced-typing-text.typing-complete::after {
        animation: none;
        opacity: 0;
    }
`;
document.head.appendChild(style);