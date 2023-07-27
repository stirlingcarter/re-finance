const body = document.body;

const btnHamburger = document.querySelector('.fa-bars');

const addThemeClass = (bodyClass) => {
  body.classList.add(bodyClass);
};

addThemeClass('dark');

const displayList = () => {
  const navUl = document.querySelector('.nav__list');

  if (btnHamburger.classList.contains('fa-bars')) {
    btnHamburger.classList.remove('fa-bars');
    btnHamburger.classList.add('fa-times');
    navUl.classList.add('display-nav-list');
  } else {
    btnHamburger.classList.remove('fa-times');
    btnHamburger.classList.add('fa-bars');
    navUl.classList.remove('display-nav-list');
  }
};

btnHamburger.addEventListener('click', displayList);

function rowsToColumns(rows) {
    return rows[0].map((_, i) => rows.map(row => row[i]));
}

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

function calculateRealEstateReturn(mortgageTerm, principle, downPayment, taxRate, insuranceRate, maintenanceRate, rentProfitRate, otherExpensesRate, loanInterestRate, appreciationRate, vacancyRate, rentalAppreciationInterval) {
    
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

    let virtualHomeValue = homeValue;

    for (let year = 1; year <= mortgageTerm; year++) {
        homeValue = staticAppreciation ? homeValue + appreciationRate : homeValue * (1 + appreciationRate);
        if (year % rentalAppreciationInterval == 0) {
            virtualHomeValue = homeValue;
        }
        let rentProfit = staticRentProfit ? 12 * (rentProfitRate * (1-vacancyRate)) : virtualHomeValue * rentProfitRate * 12 * (1 - vacancyRate);        let tax = homeValue * taxRate;
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
            formatNumber(profit),
            formatNumber(rentProfit),
            formatNumber(totalCosts),
            formatNumber(principalPaid),
            formatNumber(interestForTheYear),
            formatNumber(tax),
            formatNumber(insurance),
            formatNumber(maintenance),
            formatNumber(otherExpenses),
            formatNumber(netProfitLoss)
        ]); 
    }
    
    return data;
}


function calculateMIRR(cashflows, financeRate, reinvestRate) {
    let negativeCashFlows = 0;
    let positiveCashFlows = 0;

    // Sum negative and positive cash flows
    for (let i = 0; i < cashflows.length; i++) {
        if (cashflows[i] < 0) {
            negativeCashFlows += cashflows[i] / Math.pow(1 + financeRate, i);
        } else {
            positiveCashFlows += cashflows[i] * Math.pow(1 + reinvestRate, cashflows.length - 1 - i);
        }
    }

    if (negativeCashFlows < 0 && positiveCashFlows > 0) {
        // Calculate MIRR
        let mirr = Math.pow(-positiveCashFlows / negativeCashFlows, 1 / (cashflows.length - 1)) - 1;
        return mirr;
    } else {
        throw "Invalid cash flow sequence for MIRR calculation";
    }
}

function calculateIRR(cashflows) {
    const maxIteration = 100;  // Maximum number of iterations
    const acceptedError = 0.00001;  // Required precision
    let guessRate = 0.1;  // Initial guess rate

    for (let i = 0; i < maxIteration; i++) {
        let NPV = 0;
        let derivativeNPV = 0;
        for (let j = 0; j < cashflows.length; j++) {
            NPV += cashflows[j] / Math.pow(1 + guessRate, j);
            derivativeNPV -= j * cashflows[j] / Math.pow(1 + guessRate, j + 1);
        }
        let newRate = guessRate - NPV / derivativeNPV;
        if (Math.abs(newRate - guessRate) <= acceptedError) {
            return (newRate * 100).toFixed(2) + '%';
        }
        guessRate = newRate;
    }
    return 'No solution found in ' + maxIteration + ' iterations';
}

function formatNumber(num) {
    return Math.round(num).toLocaleString();
}
function unformatNumber(str) {
    if (typeof str !== 'string') {
        console.error('Expected a string, but got:', typeof str, str);
        return str;
    }
    console.log(str);
    return Number(str.replace(/,/g, ''));
}
function getCashFlows(initial, flows, finalSale){
    flows[0] -= initial;
    flows[flows.length-1] += finalSale;
    return flows; 
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
        let rentalAppreciationInterval = Number(document.getElementById("rentalAppreciationInterval").value);

        let result = calculateRealEstateReturn(mortgageTerm, principle, downPayment, taxRate, insuranceRate, maintenanceRate, rentProfitRate, otherExpensesRate, loanInterestRate, appreciationRate, vacancyRate, rentalAppreciationInterval);

        let cols = rowsToColumns(result)
        let cashflows = cols[3].map(unformatNumber)
        let salePrice = unformatNumber(cols[1][mortgageTerm-1]);
        let adjCashflows = getCashFlows(downPayment, cashflows, salePrice)
        let irr = calculateIRR(adjCashflows)

        //add new section to display irr above the table 
        let irrSection = document.getElementById("irr");
        irrSection.innerHTML = "";
        let irrHeader = document.createElement("h1");
        irrHeader.textContent = "IRR: " + irr;
        irrSection.appendChild(irrHeader);


        let outputBody = document.getElementById("outputBody");
        outputBody.innerHTML = "";

        // Creating and adding the header row
        let headerRow = document.createElement("tr");
        let headers = ["Year", "Home Value", "Debt Owed", "Cash Flow", "Rental Profit", "Total Costs", "Principal Paid", "Interest Paid", "Tax", "Insurance", "Maintenance", "Other Expenses", "Profit T.D."];
        let columnClasses = ["column1", "column1", "column2", "column1", "column2", "column2", "column1", "column2", "column1", "column2", "column1", "column2", "column1"];
        let backgroundColors = ["", "", "", "", "", "", "#330000", "#330000", "#330000", "#330000", "#330000", "#330000", ""];

        for(let i = 0; i < headers.length; i++) {
            let th = document.createElement("th");
            th.textContent = headers[i];
            th.className = columnClasses[i];
            if(backgroundColors[i] !== "") {
                th.style.backgroundColor = backgroundColors[i];
            }
            headerRow.appendChild(th);
        }
        outputBody.appendChild(headerRow);

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