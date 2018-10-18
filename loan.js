function loan()
{

// Input ===================================================================
var Loan=Number(document.getElementById('Loan').value);    // Principal or Loan Amount
var n_yr=Number(document.getElementById('n_yr').value);        // # of payments yearly
var term=Number(document.getElementById('term').value);        // loan term, years
var int_yr=Number(document.getElementById('int_yr').value);    // fixed rate percentage

var min_pay=document.getElementById("min_payT").checked;      // Pay minimum amount? 0 = no, 1 = yes
var P_ot=Number(document.getElementById('P_ot').value); 	// Montly payment, $

var injection=document.getElementById("injectionT").checked;    // Injection to period payment? 0 = no, 1 = yes
var inj=Number(document.getElementById('inj').value);      // Injection amount, $
var dt=Number(document.getElementById('dt').value);			// Injections every, months
// =========================================================================

var n_max=n_yr*term;    // max total number of payments
var int=int_yr/(100*n_yr);  // monthly interest

var D=(Math.pow((1+int),n_max)-1) / (int*Math.pow((1+int),n_max));    // discount factor
var P_min=Loan/D;     // minimum monthly payment to pay it by the end of the term, $
if (min_pay==0)
{
    if (P_ot<=Loan*int)
    {
        alert("Periodic payment is too low. You'll never pay off the loan. It must be greater than $ " + (Loan*int).toFixed(2));
        throw new Error();
    }
    else
    {
    	// document.getElementById("P_ot").disabled=false;
        var P_m=P_ot;
    }
}
else 
{
	// document.getElementById("P_ot").disabled=true;
	var P_m=P_min;
}

var T_paid_max=P_min*n_max; 	// total paid after 30 years, $
var T_int_max=T_paid_max-Loan; 	// total interest paid after 30 years, $

var Prin = new Array(n_max);

for (i=0; i<n_max; i++)
{
	Prin[i]=0;
}

// var P_int=Prin;
// var P_act=Prin;

var P_int = new Array(n_max);

for (i=0; i<n_max; i++)
{
	P_int[i]=0;
}

var P_act = new Array(n_max);

for (i=0; i<n_max; i++)
{
	P_act[i]=0;
}

var i=0;
while (1)
{
    if (i==0)
    {
        P_int[0]=Loan*int;
        P_act[0]=P_m-P_int[0];
        Prin[0]=Loan-P_act[0];
    }
    else if (injection==1 && i>=11 && ((i+1) % dt)==0)
    {
        P_int[i]=Prin[i-1]*int;
        P_act[i]=(P_m+inj)-P_int[i];
        Prin[i]=Prin[i-1]-P_act[i];
    }
    else
    {
    	P_int[i]=Prin[i-1]*int;
        P_act[i]=P_m-P_int[i];
        Prin[i]=Prin[i-1]-P_act[i];
    }
    
    // if (i==100 && Prin(i)>=Prin(i-1))
    //     error('Principal never decreases. You fkced up!!')
    // end
    
    if (Prin[i]<=1)
    {
    	P_int[i]=Prin[i-1]*int;
        P_act[i]=Prin[i-1];
        Prin[i]=Prin[i-1]-P_act[i];
        {break;}
    }
    i++;
}

var length=i+1;

var T_act=0;

for(i=0; i<length; i++)
{
	T_act=T_act+P_act[i];
}

var T_int=0;

for(i=0; i<length; i++)
{
	T_int=T_int+P_int[i];
}

var T_paid=T_int+T_act;

//Graph 1 ================================================================================
var month = new Array(length);

for (i=0; i<length; i++)
{
    month[i]=(i+1)/n_yr;
}

var coords1 = month.map( (v,i) => ({ x: v, y: P_int[i] }) );
var coords2 = month.map( (v,i) => ({ x: v, y: P_act[i] }) );

document.getElementById('graphLocation1').innerHTML="<canvas id='myChart3'></canvas>";

var myChart3 = document.getElementById('myChart3').getContext('2d');

Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

var massPopChart3 = new Chart(myChart3, {
    type: 'scatter',
    data:{
        datasets:[{
            label: 'Interest',
            data: coords1,
            backgroundColor:'rgba(255, 99, 132, 0.6)',
            showLine: true
        },
        {
            label: 'Principal',
            data: coords2,
            backgroundColor:'rgba(54, 162, 235, 0.6)',
            showLine: true
        }]
    },
    options:{
        title:{
            display:true,
            text:'How Much of The Periodic Payments Go To What',
            fontSize:25
        },
        scales:{
            xAxes: [{
                scaleLabel: {
                    display: true,                    
                    labelString: "Years"
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,                    
                    labelString: "$"
                }
            }]
        }        
    }        
});
// ============================================================================

// Graph 2 ====================================================================
// document.getElementById('graphLocation2').innerHTML="<canvas id='barChart'></canvas>";

// var barChart = document.getElementById('barChart').getContext('2d');

// Chart.defaults.global.defaultFontFamily = 'Lato';
// Chart.defaults.global.defaultFontSize = 18;
// Chart.defaults.global.defaultFontColor = '#777';

// var barChart = new Chart(barChart, {
//     type: 'bar',
//     data:{
//         datasets:[{
//             label: 'Interest',
//             data: coords1,
//             backgroundColor:'rgba(255, 99, 132, 0.6)',
//             showLine: true
//         },
//         {
//             label: 'Principal',
//             data: coords2,
//             backgroundColor:'rgba(54, 162, 235, 0.6)',
//             showLine: true
//         }]
//     },
//     options:{
//         title:{
//             display:true,
//             text:'How Much of The Periodic Payments Go To What',
//             fontSize:25
//         },
//         scales:{
//             xAxes: [{
//                 scaleLabel: {
//                     display: true,                    
//                     labelString: "Years"
//                 }
//             }],
//             yAxes: [{
//                 scaleLabel: {
//                     display: true,                    
//                     labelString: "$"
//                 }
//             }]
//         }
        
//     }
        
// });
// ============================================================================

// Table - Result Input ======================================
var table_res=document.getElementById("result");
table_res.rows[0].cells[1].innerHTML="$ " + P_m.toFixed(2);

i=1;
var r=table_res.rows.length;
if (r>4)
{
	table_res.deleteRow(i);
}

if (injection==1)
{
	var row=table_res.insertRow(i++);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	cell1.innerHTML="Injection:"
	cell2.innerHTML="$ " + inj + " every " + dt + " months";
}

table_res.rows[i++].cells[1].innerHTML=(length/n_yr).toFixed(2) + " years";
table_res.rows[i++].cells[1].innerHTML="$ " + T_paid.toFixed(2);
table_res.rows[i++].cells[1].innerHTML="$ " + T_int.toFixed(2);
//===========================================================

// Table - Amortization =====================================
var table2 = document.getElementById("mytable");

var r=table2.rows.length;

for (i=1; i<r; i++)
{
	table2.deleteRow(1);
}

for (j=0; j<length; j++)
{
	var row=table2.insertRow(j+1);
	var cell1=row.insertCell(0);				
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	var cell4=row.insertCell(3);
	var cell5=row.insertCell(4);
	cell1.innerHTML=j+1;
	cell2.innerHTML=(j+1)*(12/n_yr);
	cell3.innerHTML="$ " + P_int[j].toFixed(2);
	cell4.innerHTML="$ " + P_act[j].toFixed(2);
	cell5.innerHTML="$ " + Prin[j].toFixed(2);
    // table2.rows[j+1].cells[2].style.textAlign = "right";
    // table2.rows[j+1].cells[3].style.textAlign = "right";
    // table2.rows[j+1].cells[4].style.textAlign = "right";
}
//===========================================================

}