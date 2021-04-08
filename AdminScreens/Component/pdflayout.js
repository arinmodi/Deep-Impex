export const htmlContent = (data) => {
    console.log(data);
        return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>Testing</title>
                <style>
                    body {
                        font-size: 16px;
                    }
        
                    h1 {
                        text-align: center;
                    }
        
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                    }
        
                    td, th {
                        border: 1px solid black;
                        text-align: left;
                        padding: 8px;
                    }
        
                    tr:nth-child(even) {
                        background-color: #dddddd;
                    }     
                    
                    @media print{
                        .pagebreak { page-break-after : always; }
                    }

                    .div {
                        display:  flex;
                        flex-direction:  row;
                        justify-content:  space-between;
                    }

                    .wallet {
                        color:  blue;
                    }

                </style>
            </head>
        
            ` +
                data.map(element => 
                       `
                       <body>
                        <h1>${element.Name}</h1>
                        <div class = "div">
                            <h2>Date : ${element.Date}</h2>
                            <h2 class = "wallet">Wallet: ${element.Wallet}</h2>
                        </div>
                        <table>
                            <thead>
                                <tr style="background-color:#85FF88">
                                    <th>Sr.No</th>
                                    <th>Name</th>
                                    <th>Quantity</th>
                                    <th>Unit</th>
                                    <th>Rate</th>
                                    <th>Person</th>
                                    <th>Debit</th>
                                    <th style="background-color:red;color:white;">Credit</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>`+
                
                            element.Items.map(user => 
                                `
                                <tr>
                                    <td>${user.SrNo}</td>
                                    <td>${user.Name}</td>
                                    <td>${user.Quantity}</td>
                                    <td>${user.Unit}</td>
                                    <td>${user.Rate}</td>
                                    <td>${user.By}</td>
                                    <td>${user.debit}</td>
                                    <td>${user.credit}</td>
                                    <td>${user.Total}</td>
                                </tr>
                                
                                `
                            )
                
                            +
                            `</tbody>
                        </table>
                        <h3 style = "margin-top : 10;color : green;">Grand Debit : ${element.Debit} </h3>
                        <h3 style = "color : red;">Grand Credit : ${element.Credit} </h3>
                        <h3 style = "color : blue;">Grand Purchase : ${element.Credit + element.Debit} </h3>
                        <div class = "pagebreak"></div>
                        </body>`
                ) +
                `</html>`
}