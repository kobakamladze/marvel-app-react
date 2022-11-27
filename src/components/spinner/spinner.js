import { Component } from 'react';

class Spinner extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            margin: 'auto',
            background: 'rgb(255, 255, 255)',
            display: 'block',
            darkreaderInlineBgimage: 'initial',
            darkreaderInlineBgcolor: '#181a1b',
            shapeRendering: 'auto',
          }}
          width="177px"
          height="177px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            stroke="#ff0011"
            strokeWidth="9"
            r="25"
            strokeDasharray="117.80972450961724 41.269908169872416"
            style={{ darkreaderInlineStroke: '#ff1a29' }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              repeatCount="indefinite"
              dur="0.9174311926605504s"
              values="0 50 50;360 50 50"
              keyTimes="0;1"
            ></animateTransform>
          </circle>
        </svg>
      </div>
    );
  }
}

export default Spinner;
