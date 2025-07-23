 function toggleDropdown(e) {
    e.preventDefault();
    document.getElementById("moreModal").style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
  
  function closeModal() {
    document.getElementById("moreModal").style.display = "none";
    document.body.style.overflow = "auto"; // Re-enable scrolling
  }
  
  // Close modal when clicking outside content
  window.onclick = function(event) {
    const modal = document.getElementById("moreModal");
    if (event.target === modal) {
      closeModal();
    }
  }
  
  // Close modal with Escape key
  document.onkeydown = function(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  };