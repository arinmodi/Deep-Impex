export const htmlContent = (data) => {
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
                        color:  red;
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
                            <h2 class = "wallet">Total: ${element.Total}</h2>
                        </div>


                        <div class = "div">
                        <table style="margin-bottom: 2%;width : 50%;margin-right : 2%">
                            <thead>
                                <tr style="background-color:#85FF88">
                                    <th>Sr.No</th>
                                    <th>Peron Name</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>`+
                                element.credperondata.map(creditperson => 
                                `<tr>
                                    <td>${creditperson.SrNo}</td>
                                    <td>${creditperson.Name}</td>
                                    <td>${creditperson.Amount}</td>
                                </tr>`
                                ) + `</tbody>
                        </table>
                        <table style="margin-bottom: 2%;width : 50%;margin-left : 2%">
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Peron Name</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>`+

                                element.employeedata.map(empdata => 
                                    `<tr style="background-color:#85FF88">
                                        <td>${empdata.SrNo}</td>
                                        <td>${empdata.Name}</td>
                                        <td>${empdata.Amount}</td>
                                    </tr>`
                                )        
                            + `</tbody>
                        </table>
                    </div>

                        <table>
                            <thead>
                                <tr style="background-color:#85FF88">
                                    <th>Sr.No</th>
                                    <th>Item Name</th>
                                    <th>Person Name</th>
                                    <th>Amount</th>
                                    <th>Taken By</th>
                                </tr>
                            </thead>
                            <tbody>`+
                
                            element.credits.map(user => 
                                `
                                <tr>
                                    <td>${user.SrNo}</td>
                                    <td>${user.Name}</td>
                                    <td>${user.PersonName}</td>
                                    <td>${user.Amount}</td>
                                    <td>${user.By}</td>
                                </tr>
                                
                                `
                            )
                
                            +
                            `</tbody>
                        </table>
                        <div class = "pagebreak"></div>
                        </body>`
                ) +
                `</html>`
}