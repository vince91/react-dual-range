import * as ReactDOM from "react-dom";
import * as React from "react";
import RangeSlider from "../src/RangeSlider";
import "../src/style.scss";
import "./style.scss";

class App extends React.Component {
  state = {
    valueMin: 0,
    valueMax: 100
  };

  handleValueMinChange = (valueMin: number) => {
    this.setState({ valueMin });
  };

  handleValueMaxChange = (valueMax: number) => {
    this.setState({ valueMax });
  };

  render() {
    return (
      <>
        <RangeSlider
          min={0}
          max={100}
          step={1.5}
          valueMin={this.state.valueMin}
          valueMax={this.state.valueMax}
          onValueMinChange={this.handleValueMinChange}
          onValueMaxChange={this.handleValueMaxChange}
        />
        <div>
          {this.state.valueMin} - {this.state.valueMax}
        </div>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
