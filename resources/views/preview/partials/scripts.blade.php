<script>
	const themeToggle = document.getElementById('theme-toggle');
	const htmlElement = document.documentElement;

	themeToggle.addEventListener('change', (event) => {
		if (event.target.checked) {
			htmlElement.classList.add('wa-theme-dark');
		} else {
			htmlElement.classList.remove('wa-theme-dark');
		}
	});
</script>
