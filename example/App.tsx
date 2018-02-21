import * as ReactDOM from "react-dom";
import * as React from "react";
import RangeSlider from "../src/RangeSlider";
import "../src/style.scss";
import "./style.scss";

interface State {
  values: [number, number];
}

class App extends React.Component<null, State> {
  state: State = { values: [0, 100] };

  handleChange = (values: [number, number]) => {
    this.setState({ values });
  };

  render() {
    return (
      <>
        <RangeSlider
          range={[100, 0]}
          step={1.5}
          values={this.state.values}
          onChange={this.handleChange}
        />
        <div>{this.state.values.join("   -   ")}</div>
      </>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
