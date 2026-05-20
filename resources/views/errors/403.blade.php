@extends('errors::minimal')

@section('title', __('errors.forbidden_title'))
@section('message')
    <div class="error-card">
        <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        </div>
        <h1 class="error-code">403</h1>
        <h2 class="error-title">{{ __('errors.forbidden_title') }}</h2>
        <p class="error-message">{{ __($exception->getMessage() ?: 'errors.forbidden_message') }}</p>
        <p class="warning-text">{{ __('errors.action_reported') }}</p>
        
        <div class="action-buttons">
            <button onclick="window.history.back()" class="back-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                {{ __('errors.go_back') }}
            </button>
            <a href="{{ url('/main') }}" class="home-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="button-icon">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {{ __('errors.go_home') }}
            </a>
        </div>

        

        <div class="redirect-timer">
            <p>{{ __('errors.redirect_message') }} <span id="countdown">10</span> {{ __('errors.seconds') }}</p>
        </div>
    </div>

    <script>
        // Countdown timer
        let seconds = 10;
        const countdownElement = document.getElementById('countdown');
        
        const countdownTimer = setInterval(() => {
            seconds--;
            countdownElement.textContent = seconds;
            
            if (seconds <= 0) {
                clearInterval(countdownTimer);
                window.location.href = '{{ url('/main') }}';
            }
        }, 1000);
    </script>

    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
        }
        
        .error-card {
            max-width: 500px;
            margin: 2rem auto;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .error-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 1rem;
            color: #e53e3e;
        }
        
        .error-code {
            font-size: 3rem;
            font-weight: 700;
            margin: 0;
            color: #e53e3e;
        }
        
        .error-title {
            font-size: 1.5rem;
            margin: 0.5rem 0;
            color: #2d3748;
        }
        
        .error-message {
            margin: 1rem 0;
            color: #4a5568;
        }
        
        .warning-text {
            margin: 1rem 0;
            color: #e53e3e;
            font-size: 0.875rem;
            padding: 0.5rem;
            background-color: rgba(229, 62, 62, 0.1);
            border-radius: 4px;
            border-left: 3px solid #e53e3e;
        }
        
        .action-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .back-button, .home-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            transition: all 0.2s;
            text-decoration: none;
        }
        
        .back-button {
            background-color: #4a5568;
            color: white;
        }
        
        .back-button:hover {
            background-color: #2d3748;
            transform: translateY(-2px);
        }
        
        .home-button {
            background-color: #3182ce;
            color: white;
        }
        
        .home-button:hover {
            background-color: #2c5282;
            transform: translateY(-2px);
        }
        
        .button-icon {
            width: 16px;
            height: 16px;
        }
        
        .helpful-links {
            margin: 1.5rem 0;
            padding: 1rem;
            background-color: #f7fafc;
            border-radius: 4px;
            text-align: left;
        }
        
        .helpful-links p {
            margin: 0 0 0.5rem 0;
            font-weight: 600;
        }
        
        .helpful-links ul {
            margin: 0;
            padding-left: 1.5rem;
        }
        
        .helpful-links a {
            color: #3182ce;
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .helpful-links a:hover {
            color: #2c5282;
            text-decoration: underline;
        }
        
        .redirect-timer {
            margin-top: 1.5rem;
            font-size: 0.875rem;
            color: #718096;
        }
        
        #countdown {
            font-weight: bold;
            color: #e53e3e;
        }
    </style>
@endsection

