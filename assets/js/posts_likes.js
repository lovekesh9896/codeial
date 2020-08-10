{
    $('.toogle-like-button').each(function(){
        let self = this;
        // let toogleLike = new toogleLike(self);
    })

    // let likeToogle = function(){
    //     let 
    // }

    let likeButtons = document.getElementsByClassName('like-toogle-form');

    for(let i=0;i<likeButtons.length;i++){
        $(likeButtons[i]).click(function(event){
            event.preventDefault();
            console.log(event.target.value);
        })
    }
}