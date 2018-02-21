import * as React from "react";

interface Props {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onValueMinChange: (value: number) => void;
  onValueMaxChange: (value: number) => void;
}

interface State {
  dragging: "left" | "right" | false;
}

interface StyleFunc {
  (value: number): React.CSSProperties;
}

function isEqual(a: number, b: number) {
  return Math.abs(a - b) < (Number as any).EPSILON;
}

export default class RangeSlider extends React.Component<Props, State> {
  trackRef: HTMLDivElement = null;

  state: State = {
    dragging: false
  };

  setTrackRef = (ref: HTMLDivElement) => (this.trackRef = ref);

  getPosition = (value: number) => {
    const width = this.trackRef.offsetWidth;
    const { min, max } = this.props;
    return width * (value - min) / (max - min);
  };

  getStyle: StyleFunc = (value: number) => {
    return this.trackRef
      ? {
          transform: `translateX(${this.getPosition(value)}px)`
        }
      : { display: "none" };
  };

  handleLeftHandleMouseDown = () => {
    document.addEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: "left" });
  };

  handleRightHandleMouseDown = () => {
    document.addEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: "right" });
  };

  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.setState({ dragging: false });
  };

  handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    const { max, min, step, valueMin, valueMax } = this.props;
    const { dragging } = this.state;
    const width = this.trackRef.offsetWidth;
    const position = Math.min(
      Math.max(event.clientX - this.trackRef.getBoundingClientRect().left, 0),
      width
    );

    const rawValue = position * (max - min) / width + min;

    const value = min + step * Math.round((rawValue - min) / step);

    if (dragging === "left" && !isEqual(valueMin, value)) {
      this.props.onValueMinChange(value);
    } else if (dragging === "right" && !isEqual(valueMax, value)) {
      this.props.onValueMaxChange(value);
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    this.forceUpdate();
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    const { valueMin, valueMax } = this.props;

    return (
      <div className="react-drs">
        <div className="react-drs_track" ref={this.setTrackRef}>
          <div className="react-drs_dot react-drs_right-dot" />
          <div className="react-drs_dot react-drs_left-dot" />
          <div
            className="react-drs_handle"
            style={this.getStyle(valueMin)}
            onMouseDown={this.handleLeftHandleMouseDown}
          />
          <div
            className="react-drs_handle"
            style={this.getStyle(valueMax)}
            onMouseDown={this.handleRightHandleMouseDown}
          />
        </div>
      </div>
    );
  }
}
