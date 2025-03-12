document.addEventListener('DOMContentLoaded', () => {
      const darkBtn = document.querySelector('.color-switcher__dark');
      const lightBtn = document.querySelector('.color-switcher__light');
      
      function updateActiveState(isDark) {
        if (isDark) {
          darkBtn.classList.add('active');
          lightBtn.classList.remove('active');
          document.body.classList.add('dark-theme');
          document.body.classList.remove('light-theme');
        } else {
          lightBtn.classList.add('active');
          darkBtn.classList.remove('active');
          document.body.classList.add('light-theme');
          document.body.classList.remove('dark-theme');
        }
      }
    

      darkBtn.addEventListener('click', () => {
        updateActiveState(true);
        localStorage.setItem('theme', 'dark');
      });
    
      lightBtn.addEventListener('click', () => {
        updateActiveState(false);
        localStorage.setItem('theme', 'light');
      });
    
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        updateActiveState(true);
      } else {
        updateActiveState(false);
      }
    });