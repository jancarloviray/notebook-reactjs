/** @jsx React.DOM */

/*
 * - never use state when you're in the first step of building the app (building the static version)
 * - I would say this is a module with small components as the widgets.
 * - Seems like the data is passed through the topmost parent wrapper and is then passed downstream
 * - Every little section that would have moving/dynamic parts would be considered a widget and be created as a new component.
 * - The very first step is to actually create the static version, without thinking about the domain yet. This seems to be more design-oriented process (which in theory, is not right... but in real-world practice... it's definitely the right approach).
 */

var PRODUCTS = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

// displays a heading for each category
var ProductCategoryRow = React.createClass({
    render: function(){
        return (
            <tr><th colSpan="2">{this.props.category}</th></tr>
        );
    }
});

// displays a row for each product
var ProductRow = React.createClass({
    render: function(){
        var name = this.props.product.stocked ? this.props.product.name :
            <span style={{color: 'red'}}>
                {this.props.product.name}
            </span>;

        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
});

var ProductTable = React.createClass({
    render: function(){
        var rows = [];
        var lastCategory = null;

        this.props.products.forEach(function(product){
            if(product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)){
                  return;
            }
            if(product.category !== lastCategory){
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category}/>
                );
            }

            rows.push(
                <ProductRow
                    product={product}
                    key={product.name}/>
            );
            lastCategory = product.category;
        }.bind(this));

        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        )
    }
})

var SearchBar = React.createClass({
    handleChange: function(){
        this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value,
            this.refs.inStockOnlyInput.getDOMNode().checked
        );
    },
    render: function(){
        return (
            <form>
            <input
            type="text"
            placeholder="Search..."
            value={this.props.filterText}
            ref="filterTextInput"
            onChange={this.handleChange}/>
            <p>
            <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}/>
            {' '}
            Only show products in stock
            </p>
            </form>
        );
    }
});

var FilterableProductTable = React.createClass({
    getInitialState: function(){
        return {
            filterText: '',
            inStockOnly: false
        }
    },
    handleUserInput: function(filterText, inStockOnly){
        this.setState({
            filterText: filterText,
            inStockOnly: inStockOnly
        });
    },
    render: function(){
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onUserInput={this.handleUserInput}
                />
            </div>
        );
    }
});

React.render(<FilterableProductTable products={PRODUCTS}/>, document.body);
