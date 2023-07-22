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

function calculateMonthlyPayment(principle, loanInterestRate, mortgageTerm) {
    var monthlyInterestRate = loanInterestRate / 12.0;
    var numberOfPayments = mortgageTerm * 12;
    var denominator = (1 - Math.pow((1 + monthlyInterestRate), -numberOfPayments));
    var monthlyPayment = principle * monthlyInterestRate / denominator;
    return monthlyPayment;
}

function calculateRealEstateReturn(mortgageTerm, principle, downPayment, taxRate, insuranceRate, maintenanceRate, rentProfitRate, otherExpensesRate, loanInterestRate, appreciationRate, vacancyRate) {
    
    let staticMaintenance = true;
    let staticOtherExpenses = true;
    let staticRentProfit = true;
    let staticAppreciation = true;

    if (maintenanceRate > -1 && maintenanceRate < 1) {
        staticMaintenance = false;
    }
    if (otherExpensesRate > -1 && otherExpensesRate < 1) {
        staticOtherExpenses = false;
    }
    if (rentProfitRate > -1 && rentProfitRate < 1) {
        staticRentProfit = false;
    }
    if (appreciationRate > -1 && appreciationRate < 1) {
        staticAppreciation = false;
    }

    let homeValue = principle + downPayment;
    let loanAmount = principle;
    let netProfitLoss = 0;
    let monthlyPayment = calculateMonthlyPayment(principle, loanInterestRate, mortgageTerm);
    
    let data = [];

    for (let year = 1; year <= mortgageTerm; year++) {
        homeValue = staticAppreciation ? homeValue + appreciationRate : homeValue * (1 + appreciationRate);
        let rentProfit = staticRentProfit ? 12 * (rentProfitRate * (1-vacancyRate)) : homeValue * rentProfitRate * 12 * (1 - vacancyRate);
        let tax = homeValue * taxRate;
        let insurance = homeValue * insuranceRate;
        let maintenance = staticMaintenance ? maintenanceRate : homeValue * maintenanceRate;
        let otherExpenses = staticOtherExpenses ? otherExpensesRate : homeValue * otherExpensesRate;

        let interestForTheYear = loanAmount * loanInterestRate;
        let principalPaid = monthlyPayment * 12 - interestForTheYear;
        loanAmount -= principalPaid;
        
        let totalCosts = tax + insurance + maintenance + otherExpenses + interestForTheYear + principalPaid;
        let profit = rentProfit - totalCosts;
        netProfitLoss += profit;

        // Add row to data
        data.push([
            year,
            formatNumber(homeValue),
            formatNumber(loanAmount),
            formatNumber(netProfitLoss),
            formatNumber(totalCosts),
            formatNumber(profit),
            formatNumber(rentProfit),
            formatNumber(tax),
            formatNumber(insurance),
            formatNumber(maintenance),
            formatNumber(otherExpenses),
            formatNumber(principalPaid),
            formatNumber(interestForTheYear)
        ]); 
    }
    
    return data;
}

function formatNumber(num) {
    return Math.round(num).toLocaleString();
}


window.onload = function() {
    document.getElementById("calcForm").onsubmit = function(e) {
        e.preventDefault();

        let mortgageTerm = Number(document.getElementById("mortgageTerm").value);
        let principle = Number(document.getElementById("principle").value);
        let downPayment = Number(document.getElementById("downPayment").value);
        let taxRate = Number(document.getElementById("taxRate").value);
        let insuranceRate = Number(document.getElementById("insuranceRate").value);
        let maintenanceRate = Number(document.getElementById("maintenanceRate").value);
        let rentProfitRate = Number(document.getElementById("rentProfitRate").value);
        let otherExpensesRate = Number(document.getElementById("otherExpensesRate").value);
        let loanInterestRate = Number(document.getElementById("loanInterestRate").value);
        let appreciationRate = Number(document.getElementById("appreciationRate").value);
        let vacancyRate = Number(document.getElementById("vacancyRate").value);
        

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
                td.style.padding = "5px";
                tr.appendChild(td);
            }
            outputBody.appendChild(tr);
        }
    }
}

// window.onload = function() {
//     document.getElementById("input_boxes").reset();
// }