const styles = {
  container: {
    backgroundColor: "gray",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column"
  },
  displayContainer: {
    backgroundColor: "black",
    padding: "5px",
    margin: "5px",
    borderRadius: "5px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "right",
    minHeight: "60px",
    maxWidth: "290px"
  },
  input: {
    fontFamily: "Orbitron, serif",
    fontOpticalSizing: "auto",
    fontWeight: "400",
    fontStyle: "normal",
    color: "white",
    fontSize: "15px",
    whiteSpace: 'nowrap',
    overflow: "hidden",
    letterSpacing: "3px",
    height: "20px",
    maxHeight: "20px",
    width: "100%",
    maxWidth: "100%",
    display: "flex",
    justifyContent: "right",
    alignItems: "center"
  },
  output: {
    fontFamily: "Orbitron, serif",
    fontOpticalSizing: "auto",
    fontWeight: "400",
    fontStyle: "normal",
    color: "white",
    fontSize: "20px",
    whiteSpace: 'nowrap',
    overflow: "hidden"
  },
  keysContainer: {
    width: "100vw",
    height: "100vw",
    maxWidth: "300px",
    maxHeight: "300px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(5, 1fr)",
    padding: "5px",
    gap: "5px"
  }
};

const keyMap = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  "*": "multiply",
  "/": "divide",
  "+": "plus",
  "-": "subtract",
  "=": "equals",
  ".": "decimal",
  Backspace: "erase",
  Delete: "clear"
};

const operatorMap = {
  add: "+",
  subtract: "-",
  multiply: "*",
  divide: "/"
};

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "0"
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDepress = this.handleKeyDepress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clear = this.clear.bind(this);
    this.erase = this.erase.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.digitsInput = this.digitsInput.bind(this);
    this.operatorInput = this.operatorInput.bind(this);
    this.createInputDisplay = this.createInputDisplay.bind(this);
    this.calculate = this.calculate.bind(this);
    this.addResult = this.addResult.bind(this);
    this.subtractResult = this.subtractResult.bind(this);
    this.divideResult = this.divideResult.bind(this);
    this.multiplyResult = this.multiplyResult.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    document.addEventListener("keyup", this.handleKeyDepress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
    document.removeEventListener("keyup", this.handleKeyDepress);
  }

  handleKeyPress(event) {
    const button = document.getElementById(keyMap[event.key]);

    if (button) {
      button.classList.add("active");
    }
  }

  handleKeyDepress(event) {
    const button = document.getElementById(keyMap[event.key]);

    if (button) {
      button.classList.remove("active");
      this.handleAction(button);
    }
  }

  handleClick(event) {
    this.handleAction(event.target);
  }

  clear() {
    this.setState({
      input: "",
      output: "0"
    });
  }

  erase() {
    let inputValue = this.state.output.slice(0, -1);

    if (inputValue == "") inputValue = "0";

    this.setState({
      output: inputValue
    });
  }

  digitsInput(inputValue) {
    if (this.state.input[this.state.input.length - 1] === "=")
      this.clear();

    if (
      (inputValue === "0" && (this.state.output === "0" || this.state.output === "-0")) ||
      (inputValue === "." && this.state.output.includes("."))
    ) {
      return;
    } else if ((this.state.output === "0" || this.state.output === "-0") && inputValue != ".") {
      this.setState({
        output: inputValue
      });
    } else if (this.state.output === "-" && inputValue == ".") {
      this.setState({
        output: "-0."
      });
    }
    else {
      this.setState((state) => ({
        output: state.output + inputValue
      }));
    }
  }

  operatorInput(type) {

    if (this.state.output[this.state.output.length - 1] === ".")
      return;

    if (this.state.input[this.state.input.length - 1] === "=") {
      this.setState(state => ({
        input: state.output + operatorMap[type],
        output: "0"
      }));

      return;
    }

    if (this.state.input === "") {
      if (type === "subtract" && this.state.output === "0")
        this.setState({
          output: "-"
        });
      else if (type === "add" && this.state.output === "-")
        this.setState({
          output: "0"
        });
      else if (this.state.output == "0" || this.state.output == "-0" || this.state.output == "-0.") {
        return
      }
      else
        this.setState(state => ({
          input: state.output + operatorMap[type],
          output: "0"
        }));
    }
    else if (this.state.output === "0") {
      if (type === "multiply" || type === "divide" || type === "add")
        this.setState(state => ({
          input: state.input.slice(0, -1) + operatorMap[type]
        }));
      else
        this.setState({
          output: "-"
        });
    }
    else if (this.state.output === "-") {
      if (type === "multiply" || type === "divide" || (type === "add" && !Number(this.state.input[this.state.input - 1])))
        this.setState(state => ({
          input: state.input.slice(0, -1) + operatorMap[type],
          output: "0"
        }));
      else if (type === "add")
        this.setState({
          output: "0"
        });
    }
    else {
      this.setState(state => ({
        input: state.input + state.output + operatorMap[type],
        output: "0"
      }));
    }
  }

  createInputDisplay() {
    const input = this.state.input;
    const inputDisplay = input.split("").map(char => {
      switch (char) {
        case "/":
          return <i class="fas fa-divide small"></i>;
        case "*":
          return <i class="fas fa-times small"></i>;
        case "-":
          return <i class="fas fa-minus small"></i>;
        case "+":
          return <i class="fas fa-plus small"></i>;
        default:
          return char;
      }
    });

    return <div style={styles.input} >{inputDisplay}</div>;
  }

  divideResult(stringNum) {
    const arr = stringNum.split("/");
    let total = 0;

    if (arr[0].includes("~"))
      total = 0 - Number(arr[0].replace("~", ""));
    else
      total = Number(arr[0]);

    for (let i = 1; i < arr.length; i++) {
      if (arr[i].includes("~"))
        total /= 0 - Number(arr[i].replace("~", ""));
      else
        total /= Number(arr[i]);
    }

    return total;
  }

  multiplyResult(stringNum) {
    const arr = stringNum.split("*");
    let total = 1;

    for (let i = 0; i < arr.length; i++) {
      total *= this.divideResult(arr[i]);
      console.log(total, " mr");
    }

    return total;
  }

  subtractResult(stringNum) {
    const arr = stringNum.split("-");
    let total = this.multiplyResult(arr[0]);

    for (let i = 1; i < arr.length; i++) {
      total -= this.multiplyResult(arr[i]);
    }

    return total;
  }

  addResult(stringNum) {
    const arr = stringNum.split("+");
    let total = 0;

    for (let i = 0; i < arr.length; i++) {
      total += this.subtractResult(arr[i]);
    }

    return total;
  }

  calculate() {
    if (!this.state.input) {
      this.setState(state => ({
        input: state.output + "=",
      }));

      return;
    }

    const equation = this.state.input + this.state.output;
    const result = this.addResult(equation.replace("--", "-~").replace("+-", "+~").replace("*-", "*~").replace("/-", "/~"));

    this.setState(state => ({
      input: state.input + state.output + "=",
      output: String(result)
    }));
  }

  handleAction(button) {
    switch (button.id) {
      case "clear":
        this.clear();
        return;

      case "erase":
        this.erase();
        return;

      case "decimal":
      case "zero":
      case "one":
      case "two":
      case "three":
      case "four":
      case "five":
      case "six":
      case "seven":
      case "eight":
      case "nine":
        this.digitsInput(button.textContent);
        return;

      case "divide":
      case "multiply":
      case "add":
      case "subtract":
        this.operatorInput(button.id);
        return;

      case "equals":
        this.calculate();
        return;

      default:
        return;
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.displayContainer}>
          {this.createInputDisplay()}
          <div id="display" style={styles.output} dir="rtl">
            {this.state.output}
          </div>
        </div>
        <div style={styles.keysContainer}>
          <button class="bg-red" id="clear" onClick={this.handleClick}>
            AC
          </button>
          <button class="bg-red" id="erase" onClick={this.handleClick}>
            <i class="fas fa-backspace"></i>
          </button>
          <button class="bg-darkgray" id="divide" onClick={this.handleClick}>
            <i class="fas fa-divide"></i>
          </button>
          <button class="bg-darkgray" id="multiply" onClick={this.handleClick}>
            <i class="fas fa-times"></i>
          </button>
          <button class="bg-lightgray" id="seven" onClick={this.handleClick}>
            7
          </button>
          <button class="bg-lightgray" id="eight" onClick={this.handleClick}>
            8
          </button>
          <button class="bg-lightgray" id="nine" onClick={this.handleClick}>
            9
          </button>
          <button class="bg-darkgray" id="subtract" onClick={this.handleClick}>
            <i class="fas fa-minus"></i>
          </button>
          <button class="bg-lightgray" id="four" onClick={this.handleClick}>
            4
          </button>
          <button class="bg-lightgray" id="five" onClick={this.handleClick}>
            5
          </button>
          <button class="bg-lightgray" id="six" onClick={this.handleClick}>
            6
          </button>
          <button class="bg-darkgray" id="add" onClick={this.handleClick}>
            <i class="fas fa-plus"></i>
          </button>
          <button class="bg-lightgray" id="one" onClick={this.handleClick}>
            1
          </button>
          <button class="bg-lightgray" id="two" onClick={this.handleClick}>
            2
          </button>
          <button class="bg-lightgray" id="three" onClick={this.handleClick}>
            3
          </button>
          <button class="bg-orange" id="equals" onClick={this.handleClick}>
            =
          </button>
          <button class="bg-lightgray" id="zero" onClick={this.handleClick}>
            0
          </button>
          <button class="bg-lightgray" id="decimal" onClick={this.handleClick}>
            .
          </button>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<Calculator />, document.getElementById("root"));