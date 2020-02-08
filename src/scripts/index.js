import '../styles/index.scss'
import $ from "jquery"
import "../../node_modules/swiper/css/swiper.css"
import Swiper from "swiper"
import Inputmask from "maskedinput"

console.log("webpack starterkit")

// swiper
$(document).ready(function() {
    $.get("/public/okopf_list.json", function(myJson) {
        const length = Object.keys(myJson.list).length
        for (let j = 0; j < length; j++) {
            const newOption = $("<option/>")
            newOption.text(myJson.list[j].title)
            newOption.attr("value", myJson.list[j].title)
            $(".js-okopf").append(newOption)
        }
    })
    $.get("/public/activity_areas_list.json", function(myJson) {
        const length = Object.keys(myJson.list).length
        for (let j = 0; j < length; j++) {
            const newOption = $("<option/>")
            newOption.text(myJson.list[j].title)
            newOption.attr("value", myJson.list[j].title)
            $(".js-industry").append(newOption)
        }
    })
    $.get("/public/employment_positions_list.json", function(myJson) {
        const length = Object.keys(myJson.list).length
        for (let j = 0; j < length; j++) {
            const newOption = $("<option/>")
            newOption.text(myJson.list[j].title)
            newOption.attr("value", myJson.list[j].title)
            $(".js-held-post").append(newOption)
        }
    })
    $.get("/public/branches_list.json", function(myJson) {
        const length = Object.keys(myJson.list).length
        for (let j = 0; j < length; j++) {
            const newOption = $("<option/>")
            newOption.text(myJson.list[j].title)
            newOption.attr("value", myJson.list[j].title)
            $(".js-department-list").append(newOption)
        }
    })
    const mySwiper = new Swiper(".swiper-container", {
        pagination: {
            el: ".progress-mobile",
            type: "bullets"
        },
        speed: 400,
        simulateTouch: false,
        autoHeight: true,
        spaceBetween: 100,
        nested: true
    })

    /**
     * Функция валидации полей
     * @param {number} num - число текущего слайда
     * @param {number} isGlobal - флаг глобальной проверки
     * @return {boolean}
     */
    function inputEmpty(num, isGlobal = false) {
        let flagRet = true
        let flagRegexp = false
        const $step = $(".js-step:eq(" + num + ")")
        $step.find(".js-input").each(function(i, elem) {
            const el = $(this)
            if (el.attr("disabled")) {
                return
            }
            const attr = el.data("reg")
            const val = el.val()
            const addIf =
                el.data("min") && el.data("max")
                    ? val < el.data("min") || val > el.data("max")
                    : false

            if (attr && !isGlobal) {
                flagRegexp = funcDataReg(attr, val, addIf, el)
            }
            if (val === "" || flagRegexp) {
                flagRet = false
            }
        })
        $step.find(".js-checkbox").each(function(i, elem) {
            if (!this.checked) {
                flagRet = false
            }
        })
        $step.find(".js-change").each(function(i, elem) {
            if (this.checked && $(".js-input-fio-old").val() === "") {
                flagRet = false
            }
        })
        $step.find(".js-select").each(function(i, elem) {
            const $el = $(this)
            if ($el.attr("disabled")) {
                return
            }
            if ($(this).val() === "0" && !isGlobal) {
                flagRet = false
                if (!$(this).hasClass("error")) {
                    addErrorText($(this))
                }
            } else {
                removeErrorText($(this))
            }
        })
        return flagRet
    }

    /**
     * создание текста под ошибочно введенными полями
     * @param {object} item
     */
    function addErrorText(item) {
        $(item)
            .addClass("error")
            .parent()
            .addClass("error-row")
            .append(
                '<span class="error-text">Пожалуйста, введите корректные данные</span>'
            )
        mySwiper.updateAutoHeight()
    }

    /**
     * удаление текста под ошибочно введенными полями
     * @param {object} item
     */
    function removeErrorText(item) {
        $(item)
            .removeClass("error")
            .parent()
            .removeClass("error-row")
            .find(".error-text")
            .remove()
        mySwiper.updateAutoHeight()
    }

    $(document).on("click", ".js-next-step", function() {
        const index = mySwiper.activeIndex
        if (inputEmpty(index)) {
            mySwiper.slideNext()
        } else {
            openModal()
        }
    })

    /**
     * Функция проверки data-атрибутов
     * @param {string} attr
     * @param {string} val
     * @param {boolean} addIf
     * @param {object} el
     * @return {boolean}
     */
    function funcDataReg(attr, val, addIf = false, el) {
        const newRegExp = new RegExp(attr)
        const isInvalid = !newRegExp.test(val) || addIf
        if (isInvalid && !el.hasClass("error")) {
            addErrorText(el)
        } else if (!isInvalid) {
            removeErrorText(el)
        }
        return isInvalid
    }

    /**
     * Функция открытия окна
     */
    function openModal() {
        $(".js-modal").addClass("modal-showed")
    }

    $(".js-modal").click(function(e) {
        if (e.target === this) {
            $(this).removeClass("modal-showed")
        }
    })
    $(document).on("click", ".js-button-back", function() {
        mySwiper.slidePrev()
    })

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

    /**
     * Функция заполнения адреса проживания
     */
    function changeAddress() {
        if ($(".js-change-address").prop("checked")) {
            $(".js-residence-address").val($(".js-registration-address").val())
            $(".js-residence-address").prop("disabled", false)
        } else {
            $(".js-residence-address").val($(".js-registration-address").val())
            $(".js-residence-address").prop("disabled", true)
        }
    }
    $(".js-registration-address").on("change", function() {
        changeAddress()
    })

    /**
     * Функция заполнения прежних имени и фамилии
     */
    function changeFio() {
        if ($(".js-change-last-fio").prop("checked")) {
            $(".js-input-fio-old").val($(".js-input-first-fio").val())
            $(".js-input-fio-old").prop("disabled", true)
        } else {
            $(".js-input-fio-old").val($(".js-input-first-fio").val())
            $(".js-input-fio-old").prop("disabled", false)
        }
    }

    /**
     * Функция вставки имени и фамилии в последний слайд
     */
    function finishName() {
        $(".js-finish-name").text($(".js-input-first-fio").val())
    }

    $(".js-input-first-fio").on("change", function() {
        changeFio()
        finishName()
    })

    $(".js-change-address").change(function() {
        $(".js-address-row").toggleClass("hide")
        mySwiper.updateAutoHeight()
    })
    $(".js-change-fio").change(function() {
        $(".js-fio-old").toggleClass("hide")
        mySwiper.updateAutoHeight()
    })
    $(".js-receiving-money").on("change", function() {
        const $bank = $(".js-bank")
        const $courier = $(".js-courier")
        $bank.toggleClass("hide")
        $courier.toggleClass("hide")

        disabledInput($bank)
        disabledInput($courier)

        /**
         * check hide fields
         * @param {"jQuery DOM object"} context
         */
        function disabledInput(context) {
            context.find(".js-receiving-money-input").each(function() {
                $(this).prop("disabled", context.hasClass("hide"))
            })
        }

        mySwiper.updateAutoHeight()
    })

    $(".js-gender").on("change", function() {
        if ($(this).data("gender") === "male") {
            $(".js-not-married").text("Холост")
            $(".js-married").text("Женат")
        } else {
            $(".js-not-married").text("Не замужем")
            $(".js-married").text("Замужем")
        }
    })

    $(".js-form").on("submit", function(e) {
        e.preventDefault()
        const steps = $(".swiper-slide").length - 2
        const validateStepArray = []

        for (let i = 0; i <= steps; i++) {
            validateStepArray.push(inputEmpty(i, true))
        }

        if (!validateStepArray.includes(false)) {
            const data = getFormData($(this))

            $.ajax({
                url: "/public/send.php",
                data: data,
                method: "POST",
                type: "json",
                success: function(msg) {
                    const fio = $(".js-input-first-fio").val()
                    const io = fio.split(" ")
                    $(".js-io").text(io[1] + " " + io[2])
                    mySwiper.slideNext()
                }
            })
            const fio = $(".js-input-first-fio").val()
            const io = fio.split(" ")
            $(".js-io").text(io[1] + " " + io[2])
        }
    })

    /**
     * вставляем все поля формы {объекты} в массив
     * @param {{Object}} $form
     * @return {{boolean}} флаг
     */
    function getFormData($form) {
        const unindexedArray = $form.serializeArray()
        const indexedArray = {}

        $.map(unindexedArray, function(n, i) {
            indexedArray[n["name"]] = n["value"]
        })

        return indexedArray
    }

    $(document).on("keyup", function(e) {
        if (e.keyCode === 27) {
            $(".js-modal").removeClass("modal-showed")
        }
    })
    $(document).on("click", ".js-change-phone-number", function() {
        mySwiper.slideTo(0)
    })
    $(document).on("click", ".button-form-back", function() {
        mySwiper.slideTo(0)
    })
    new Inputmask("+7 (999) 999-99-99").mask($(".js-phone"))
    new Inputmask("99.99.9999").mask($(".js-date"))
    new Inputmask("99-99 999999").mask($(".js-passport-series-and-number"))
    new Inputmask("999-999").mask($(".js-passport-vidan-code"))
    new Inputmask("99").mask($(".js-period"))
    new Inputmask("9").mask($(".js-sum-child"))

    /**
     * Функция смены заголовков
     */
    function changeHead() {
        const $step = $(".js-step:eq(" + mySwiper.activeIndex + ")")
        $(".js-form-head").text($step.data("title"))
    }

    mySwiper.on("slideChange", function() {
        $(".js-progress-bar").removeClass("hide")
        $(".js-progress-step").removeClass("hide")
        $(".progress-mobile .progress__bullet").removeClass("hide")
        const stepNum = parseInt(mySwiper.activeIndex) + 1
        $(".js-progress-step").text("Шаг " + stepNum + " из 5")
        const progress = stepNum * (100 / mySwiper.slides.length)
        $(".js-progress-bar").val(progress)
        $(".progress-mobile .progress__bullet").removeClass("_active")
        $(".progress-mobile .progress__bullet:nth-child(" + stepNum + ")").addClass(
            "_active"
        )
        changeHead()
        if (mySwiper.activeIndex === mySwiper.slides.length - 1) {
            $(".js-progress-bar").addClass("hide")
            $(".js-progress-step").addClass("hide")
            $(".progress-mobile .progress__bullet").addClass("hide")
        }
    })
})

// eslint-disable-next-line require-jsdoc
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
$(".js-open-answer").on("click", function() {
    $(this)
        .next(".answer")
        .toggleClass("active")
})

$(".js-scroll-to").click(function(e) {
    const id = $(this).attr("href")
    const $menu = $(".js-menu-list")
    $("html, body").animate(
        {
            scrollTop: $(id).offset().top
        },
        500
    )
    $menu.removeClass("_opened")
})
