const body = document.body

const btnTheme = document.querySelector('.fa-moon')
const btnHamburger = document.querySelector('.fa-bars')

const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass)
  btnTheme.classList.add(btnClass)
}

const getBodyTheme = localStorage.getItem('portfolio-theme')
const getBtnTheme = localStorage.getItem('portfolio-btn-theme')

addThemeClass(getBodyTheme, getBtnTheme)

const isDark = () => body.classList.contains('dark')

const setTheme = (bodyClass, btnClass) => {

	body.classList.remove(localStorage.getItem('portfolio-theme'))
	btnTheme.classList.remove(localStorage.getItem('portfolio-btn-theme'))

  addThemeClass(bodyClass, btnClass)

	localStorage.setItem('portfolio-theme', bodyClass)
	localStorage.setItem('portfolio-btn-theme', btnClass)
}

const toggleTheme = () =>
	isDark() ? setTheme('light', 'fa-moon') : setTheme('dark', 'fa-sun')

btnTheme.addEventListener('click', toggleTheme)

const displayList = () => {
	const navUl = document.querySelector('.nav__list')

	if (btnHamburger.classList.contains('fa-bars')) {
		btnHamburger.classList.remove('fa-bars')
		btnHamburger.classList.add('fa-times')
		navUl.classList.add('display-nav-list')
	} else {
		btnHamburger.classList.remove('fa-times')
		btnHamburger.classList.add('fa-bars')
		navUl.classList.remove('display-nav-list')
	}
}

btnHamburger.addEventListener('click', displayList)

const scrollUp = () => {
	const btnScrollTop = document.querySelector('.scroll-top')

	if (
		body.scrollTop > 500 ||
		document.documentElement.scrollTop > 500
	) {
		btnScrollTop.style.display = 'block'
	} else {
		btnScrollTop.style.display = 'none'
	}
}

document.addEventListener('scroll', scrollUp)

function calculateRealEstateReturn(mortgageTerm) {
    return [
        [mortgageTerm, "Row 1 Data 2"],
        ["Row 2 Data 1", "Row 2 Data 2"]
    ];
}

window.onload = function() {
    document.getElementById("calcForm").onsubmit = function(e) {
        e.preventDefault();

        let mortgageTerm = document.getElementById("mortgageTerm").value;
        let principle = document.getElementById("principle").value;
        let downPayment = document.getElementById("downPayment").value;
        let taxRate = document.getElementById("taxRate").value;
        let insuranceRate = document.getElementById("insuranceRate").value;
        let maintenanceRate = document.getElementById("maintenanceRate").value;
        let rentProfitRate = document.getElementById("rentProfitRate").value;
        let otherExpensesRate = document.getElementById("otherExpensesRate").value;
        let loanInterestRate = document.getElementById("loanInterestRate").value;
        let appreciationRate = document.getElementById("appreciationRate").value;
        let vacancyRate = document.getElementById("vacancyRate").value;

        let result = calculateRealEstateReturn(mortgageTerm, principle, downPayment, taxRate, insuranceRate, maintenanceRate, rentProfitRate, otherExpensesRate, loanInterestRate, appreciationRate, vacancyRate);

        let outputBody = document.getElementById("outputBody");
        outputBody.innerHTML = "";
        for(let row of result) {
            let tr = document.createElement("tr");
			let i = 0;
            for(let data of row) {
				i++;
                let td = document.createElement("td");
                td.textContent = data;
				td.style.backgroundColor = i % 2 == 0 ? "#2F3347" : "#3C4056";
                tr.appendChild(td);
            }
            outputBody.appendChild(tr);
        }
    }
}

// window.onload = function() {
//     document.getElementById("input_boxes").reset();
// }