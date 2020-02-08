import $ from "jquery"
import '../styles/index.scss';

$(".js-open-answer").on("click", function() {
    $(this)
        .next(".answer")
        .toggleClass("active")
})

console.log('webpack starterkit');
