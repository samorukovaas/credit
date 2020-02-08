import $ from "jquery"
import '../styles/index.scss';

$(".js-open-answer").on("click", function() {
    $(this)
        .next(".answer")
        .toggleClass("active")
})

console.log('webpack starterkit');

$(document).click(event => {
    const $target = $(event.target)
    const isClickOutsideMenu = !$target.parents(".menu").length
    const isClickBurgerBtn =
        $target.parents(".js-burger-btn").length ||
        $target.hasClass("js-burger-btn")

    if (isClickOutsideMenu && !isClickBurgerBtn) {
        closeMenu()
    }
})

$(".js-burger-btn").click(function() {
    const $element = $(".menu")
    $element.toggleClass("_opened")
})

/**
 * Функция скрытия меню
 */
function closeMenu() {
    const $element = $(".menu")
    $element.removeClass("_opened")
}


function calculatorProgress($item) {
    const val =
        ($item.val() - $item.attr("min")) / ($item.attr("max") - $item.attr("min"))
    const percent = val * 100

    $item.css(
        "background-image",
        "-webkit-gradient(linear, left top, right top, " +
        "color-stop(" +
        percent +
        "%, #FFEE00), " +
        "color-stop(" +
        percent +
        "%, #E0E0E0)" +
        ")"
    )

    $item.css(
        "background-image",
        "-moz-linear-gradient(left center, #DF7164 0%, #DF7164 " +
        percent +
        "%, #FFEE00 " +
        percent +
        "%, #E0E0E0 100%)"
    )
}

let creditSum
let creditPeriod
scaleCalculation()

/**
 * Функция расчета и вывода показателей кредитного калькулятора
 */
function scaleCalculation() {
    let rate
    if (creditSum < 500000) {
        rate = 12.99
    } else if (creditSum >= 500000 && creditSum < 1000000) {
        rate = 11.99
    } else if (creditSum >= 1000000 && creditSum < 1500000) {
        rate = 10.99
    } else {
        rate = 8.99
    }
    $(".js-credit-result-rate").text(rate)
    if (!creditPeriod) {
        creditPeriod = Number($(".js-credit-period-scale").val())
    }
    if (!creditSum) {
        creditSum = Number($(".js-credit-sum-scale").val())
    }
    const monthlyPayment =
        (creditSum * rate) / 100 / 12 + creditSum / creditPeriod
    $(".js-credit-result-monthly-payment").text(
        monthlyPayment.toFixed(0).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ")
    )
    calculatorProgress($(".js-credit-period-scale"))
    calculatorProgress($(".js-credit-sum-scale"))
}

$(".js-credit-sum-scale").on("input", function() {
    creditSum = Number($(this).val())
    $(".js-credit-sum").text(
        String(creditSum).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ")
    )
    scaleCalculation()
})
$(".js-credit-period-scale").on("input", function() {
    creditPeriod = Number($(this).val())
    const creditPeriodY = parseInt(creditPeriod / 12)
    const creditPeriodM = parseInt(creditPeriod % 12)
    let yearText
    if (creditPeriodY === 1) {
        yearText = "год"
    } else if (creditPeriodY === 5) {
        yearText = "лет"
    } else {
        yearText = "года"
    }
    let monthText
    if (creditPeriodM === 1) {
        monthText = "месяц"
    } else if (creditPeriodM > 1 && creditPeriodM < 5) {
        monthText = "месяца"
    } else {
        monthText = "месяцев"
    }
    if (creditPeriodM === 0) {
        $(".js-credit-period").text(`${creditPeriodY.toFixed()} ${yearText}`)
    } else {
        $(".js-credit-period").text(
            `${creditPeriodY.toFixed()} ${yearText} ${creditPeriodM} ${monthText}`
        )
    }
    scaleCalculation()
})

$(document).ready(function() {
    calculatorProgress($(".js-credit-period-scale"))
    calculatorProgress($(".js-credit-sum-scale"))
})