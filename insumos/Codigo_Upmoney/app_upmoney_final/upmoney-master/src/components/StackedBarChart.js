import React from "react";
import { View } from "react-native";
import { Svg, Rect, G, Text } from "react-native-svg";
import AbstractChart from "./AbstractChart";

const barWidth = 40;/*WIDTH DAS BARRAS*/

class StackedBarChart extends AbstractChart {

  getBarPercentage = () => {
    const { barPercentage = 1 } = this.props.chartConfig;
    return barPercentage;
  };

//   PONTAS ARREDONDADAS DAS BARRINHAS 
  getBarRadius = (ret, x) => {
    return this.props.chartConfig.barRadius && ret.length === x.length - 1
      ? this.props.chartConfig.barRadius
      : 3;
  };

  renderBars = config => {
    const {
      data,
      width,
      height,
      paddingTop,
      paddingRight,
      border,
      colors,
      stackedBar = false
    } = config;
    return data.map((x, i) => {
      const barWidth = 45 * this.getBarPercentage(); /*WIDTH DAS BARRAS*/
      const ret = [];
      let h = 0;
      let st = paddingTop;
      let fac = 1;
      if(stackedBar) {
        fac = .7;
      }
      for (let z = 0; z < x.length; z++) {
        h = (height - 55) * (x[z] / border);
        const y = (height / 4) * 3 - h + st;
        const xC =
          ((paddingRight + 3 ) +  //PADDINGLEFT DE TODAS AS BARRINHAS
            (i * (width + 10)) / data.length +
            barWidth / 2) *
            fac;
        ret.push(
          <Rect
            key={Math.random()}
            x={xC}
            y={y}
            rx={this.getBarRadius(ret, x)}
            ry={this.getBarRadius(ret, x)}
            width={barWidth + 1}
            height={h}
            fill={colors[z]}
          />
        );
        if (!this.props.hideLegend) {
          ret.push(
            <Text 
              key={Math.random()}
              //x={xC + 7 + barWidth / 2} /**COMENTAR O X SE FOR MOSTRAR OU NÃO A LEGENDA DAS PORCENTAGENS */
              textAnchor="end"
              y={h > 15 ? y + 15 : y + 7}
              {...this.getPropsForLabels()}
            >
              {x[z]}
            </Text>
          );
        }

        st -= h;
      }

      return ret;
    });
  };

//   LEGENDA LATERAL
  renderLegend = config => {
    const { legend, colors, width, height } = config;
    return legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.79} 
            y={height * 0.7 - i * 50}
          />
          <Text
            style={{fontWeight:'bold'}}
            x={width * 0.84}
            y={height * 0.78 - i * 50}
            {...this.getPropsForLabels()}
          >
            {x}
          </Text>
        </G>
      );
    });
  };

  render() {
    const paddingTop = 10;
    const paddingRight = 13;
    const {
      width,
      height,
      style = {},
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      segments = 4,
      decimalPlaces
    } = this.props;
    const { borderRadius = 0 } = style;
    const config = {
      width,
      height
    };
    let border = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0);
      if (actual > border) {
        border = actual;
      }
    }
    var stackedBar = data.legend && data.legend.length == 0 ? false : true;
    return (
      <View style={style}>
        <Svg height={height} width={width}>
          {this.renderDefs({
            ...config,
            ...this.props.chartConfig
          })}
          <Rect
            width="100%"
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill="url(#backgroundGradient)"
          />
          <G>
            {this.renderHorizontalLines({
              ...config,
              count: segments,
              paddingTop
            })}
          </G>
          <G>
            {withHorizontalLabels
              ? this.renderHorizontalLabels({
                  ...config,
                  count: segments,
                  data: [0, border],
                  paddingTop,
                  paddingRight,
                  decimalPlaces
                })
              : null}
          </G>
          <G style={{fontWeight:'bold'}}> 
            {withVerticalLabels
              ? this.renderVerticalLabels({
                  ...config,
                  labels: data.labels,
                  paddingRight: paddingRight - 21, //PADDING DAS LEGENDAS DE MESES
                  stackedBar,
                  paddingTop,
                  horizontalOffset: barWidth + 10
                })
              : null}
          </G>
          <G>
            {this.renderBars({
              ...config,
              data: data.data,
              border,
              colors: this.props.data.barColors,
              paddingTop,
              paddingRight: paddingRight + 15,
              stackedBar,
            })}
          </G>
          {data.legend && data.legend.length != 0 && this.renderLegend({
            ...config,
            legend: data.legend,
            colors: this.props.data.barColors
          })}
        </Svg>
      </View>
    );
  }
}
export default StackedBarChart;