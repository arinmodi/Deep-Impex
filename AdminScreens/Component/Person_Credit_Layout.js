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
                        color:  red;
                    }

                </style>
            </head>
        
            ` +
                data.map(element => 
                       `
                       <body>
                        <h1>${element.Name}(${element.PName})</h1>
                        <div class = "div">
                            <h2>Date : ${element.Date}</h2>
                            <h2 class = "wallet">Total: ${element.total}</h2>
                        </div>
                        <table>
                            <thead>
                                <tr style="background-color:#85FF88">
                                    <th>Sr.No</th>
                                    <th>Item Name</th>
                                    <th>Amount</th>
                                    <th>Person Name</th>
                                </tr>
                            </thead>
                            <tbody>`+
                
                            element.credits.map(user => 
                                `
                                <tr>
                                    <td>${user.SrNo}</td>
                                    <td>${user.Name}</td>
                                    <td>${user.Amount}</td>
                                    <td>${user.PersonName}</td>
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