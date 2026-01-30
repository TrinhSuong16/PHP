<!DOCTYPE html>
<html>
<head>
    <base href="https://demos.telerik.com/kendo-ui/mvvm/source">
    <style>html { font-size: 14px; font-family: Arial, Helvetica, sans-serif; }</style>
    <title></title>
    <link href="https://kendo.cdn.telerik.com/themes/12.3.0/default/default-ocean-blue.css" rel="stylesheet" />
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    
    
    
    <script src="https://kendo.cdn.telerik.com/2025.4.1321/js/kendo.all.min.js"></script>
    
    
</head>
<body>
    <div id="example">
    <div class="demo-section wide">
        <div class="box-col">
            <h4>Add a product</h4>
            <ul class="options">
                <li>
                    <label>Name:</label>
                    <span class="k-textbox k-input k-input-md k-rounded-md k-input-solid" style="width: 170px">
                        <input type="text" placeholder="Enter name" data-bind="value: productName" class="k-input-inner" />
                    </span>
                </li>
                <li>
                    <label>Price:</label>
                    <span class="k-textbox k-input k-input-md k-rounded-md k-input-solid" style="width: 170px">
                        <input type="text" placeholder="Enter number" data-bind="value: productPrice" class="k-input-inner" />
                    </span>
                </li>
                <li>
                    <label>Units in stock:</label>
                    <span class="k-textbox k-input k-input-md k-rounded-md k-input-solid" style="width: 170px">
                        <input type="text" placeholder="Enter number" data-bind="value: productUnitsInStock" class="k-input-inner" />
                    </span>
                </li>
                <li>
                    <button class="k-button k-button-solid-base k-button-solid k-button-md k-rounded-md" data-bind="click: addProduct">Add a new product</button>
                </li>
            </ul>
        </div>

        <table id="products" class="metrotable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Units</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody data-template="row-template" data-bind="source: products">
            </tbody>
            <tfoot data-template="footer-template" data-bind="source: this">
            </tfoot>
        </table>
    </div>

    <script id="row-template" type="text/x-kendo-template">
        <tr>
            <td data-bind="text: name">
            </td>
            <td data-bind="text: price" data-format="C">
            </td>
            <td data-bind="text: unitsInStock"></td>
            <td><button class="k-button k-button-solid-warning k-button-solid k-button-md k-rounded-md" data-bind="click: deleteProduct">Delete</button></td>
        </tr>
    </script>
    <script id="footer-template" type="text/x-kendo-template">
        <tr>
            <td>
                Products count: #: total() #
            </td>
            <td>
                Total price: #: totalPrice() #
            </td>
            <td colspan="2">
                Units in stock: #: totalUnitsInStock() #
            </td>
        </tr>
    </script>
    <script>
    $(document).ready(function() {
        var viewModel = kendo.observable({
            productName: "Product name",
            productPrice: 10,
            productUnitsInStock: 10,
            addProduct: function() {
                this.get("products").push({
                    name: this.get("productName"),
                    price: parseFloat(this.get("productPrice")),
                    unitsInStock: parseFloat(this.get("productUnitsInStock"))
                });
            },
            deleteProduct: function(e) {
                // the current data item (product) is passed as the "data" field of the event argument
                var product = e.data;

                var products = this.get("products");

                var index = products.indexOf(product);

                // remove the product by using the splice method
                products.splice(index, 1);
            },
            total: function() {
                return this.get("products").length;
            },
            totalPrice: function() {
                var sum = 0;

                $.each(this.get("products"), function(index, product) {
                    sum += product.price;
                });

                return sum;
            },
            totalUnitsInStock: function() {
                var sum = 0;

                $.each(this.get("products"), function(index, product) {
                    sum += product.unitsInStock;
                });

                return sum;
            },
            products: [
                { name: "Hampton Sofa", price: 989.99, unitsInStock: 39 },
                { name: "Perry Sofa", price: 559.99, unitsInStock: 17 },
                { name: "Donovan Sofa", price: 719.99, unitsInStock: 29 },
                { name: "Markus Sofa", price: 839.99, unitsInStock: 3 }
            ]
        });

        kendo.bind($("#example"), viewModel);
    });
    </script>
  
    <style>
        .demo-section {
        	min-height: 200px;
        }
        .metrotable > tbody > tr > td  {
        	font-size: 12px;
        }
        .metrotable > thead > tr > th {
        	font-size: 14px;
        	padding-top: 0;
        }

        .metrotable > tfoot > tr > td {
        	padding-right: 10px;
        }

        .box-col label {
            display: inline-block;
            width: 95px;
        }
        .code-sample {
            clear: right;
        }

        .prettyprint {
            background-color: #fff;
            border: 1px solid #ccc;
            overflow: auto;
            padding: 5px;
        }
    </style>
</div>



</body>
</html>
