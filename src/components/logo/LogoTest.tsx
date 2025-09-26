// Componente de logo SVG usado no cabeçalho da aplicação.
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg';

type Props = {
  size?: number;
  className?: string;
};

export default function LogoTest({ size = 120, className }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.3; // smaller semicircles

  // scale viewBox to the requested size
  return (
    <View className={className}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00A3B4" />
            <Stop offset="100%" stopColor="#013158" />
          </LinearGradient>
          <LinearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#00C3D4" />
            <Stop offset="100%" stopColor="#013158" />
          </LinearGradient>
        </Defs>

        {/* left semicircle rotated slightly */}
        <G transform={`rotate(30 ${cx} ${cy}) translate(${-(size * 0.07)},${-(size * 0.04)})`}>
          <Path
            d={`M ${cx} ${cy - radius * 1.2} A ${radius} ${radius} 0 0 0 ${cx} ${cy + radius * 1.2} L ${cx} ${cy} Z`}
            fill="url(#g1)"
          />
        </G>

        {/* right semicircle rotated slightly and nudged */}
        <G transform={`rotate(30 ${cx} ${cy}) translate(${size * 0.07},${size * 0.04})`}>
          <Path
            d={`M ${cx} ${cy - radius * 1.2} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius * 1.2} L ${cx} ${cy} Z`}
            fill="url(#g2)"
          />
        </G>
      </Svg>
    </View>
  );
}
