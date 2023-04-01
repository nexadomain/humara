// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

// When the user scrolls down 20px from the top of the document, slide down the SIDEBAR
window.onscroll = function() { scrollFunction() };
var sticky = topnav.offsetTop;
var sticky2 = mySidebar.offsetTop;

function scrollFunction() {
  if (window.pageYOffset >= sticky) {
    document.getElementById("mySidebar").style.top = "45px";
    document.getElementById("manhead").style.display = "block";
    document.getElementById("topnav").classList.add("sticky");
    document.getElementById("manhead1").style.display = "none";
  } else {
    document.getElementById("mySidebar").style.top = "113px";
    document.getElementById("manhead").style.display = "none";
    document.getElementById("manhead1").style.display = "block";
    document.getElementById("topnav").classList.remove("sticky");
  }
}