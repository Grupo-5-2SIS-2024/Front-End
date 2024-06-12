document.getElementById('open_btn').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
  
    sidebar.classList.toggle('open-sidebar');
    main.classList.toggle('expanded');
  });
  
