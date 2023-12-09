const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildrens = [...carousel.children];

  let isDragging = false, isAutoPlay = true, startX, StartScrollLeft, timeoutId;        //ch
  
  //Get the number of cards that can fit innthe carousel at once
  let cardperView = Math.round(carousel.offsetwidth / firstCardWidth);

  //insert copies of the last few cards to end of carousel for infinite scrolling
  carouselChildrens.slice(-cardperView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  })

  carouselChildrens.slice(0, cardperView).forEach(card =>{
    carousel.insertAdjacentHTML("beforeEnd", card.outerHTML);
  })

//Add event listeners for arrow buttons to scroll the carousel left and right
  arrowBtns.forEach(btn => {
    btn.addEventListener("click", () =>{
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
  });

 const dragStart = (e) =>{
    isDragging = true;
    carousel.classList.add("dragging");
    //Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    StartScrollLeft = carousel.scrollLeft;
 }

const dragging = (e) => {
    if(!isDragging) return; //if isDragging is false return here
    //Updates the scroll position of the carousel based on the cursor movement
   carousel.scrollLeft = StartScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const autoPlay = () =>{
    if(window.innerWidth < 800 || !isAutoPlay) return; //return if the window is smaller than 800
    //Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

const infiniteScroll = () => {
    //if the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0){
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    //if the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth){
        carousel.classList.add("no-transition")
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition")
    }

   //clear existing timeout & autoplay if mouse is not hovering over carousel 
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}


carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);