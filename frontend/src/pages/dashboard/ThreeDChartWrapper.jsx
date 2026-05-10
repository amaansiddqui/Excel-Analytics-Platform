import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from 'three';

const generateColors = (n) => {
  const colors = [];
  for (let i = 0; i < n; i++) {
    const hue = (i * (360 / n)) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
};

// 3D Bar Component
function ThreeDBar({ position, size, color }) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={size} />
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

// 3D Axis Component
function ThreeDAxis({ 
  axisLength, 
  xLabel, 
  yLabel, 
  xTickLabels = [], 
  yTickValues = [], 
  yAxisMax = 1 
}) {
  const axisGeometry = useMemo(() => {
    const points = [];
    // X-axis
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(axisLength, 0, 0));
    // Y-axis
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, axisLength, 0));
    // Z-axis
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(0, 0, axisLength));
    
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [axisLength]);

  return (
    <group>
      {/* Axis Lines */}
      <line geometry={axisGeometry}>
        <lineBasicMaterial color="#666666" />
      </line>

      {/* Axis Labels */}
      <Text position={[axisLength + 1, 0, 0]} fontSize={0.5} color="#333333">
        {xLabel}
      </Text>
      <Text position={[0, axisLength + 1, 0]} fontSize={0.5} color="#333333">
        {yLabel}
      </Text>
      <Text position={[0, 0, axisLength + 1]} fontSize={0.5} color="#333333">
        Z-Axis
      </Text>

      {/* X-axis tick labels */}
      {xTickLabels.map((label, i) => {
        const xPos = (i / Math.max(xTickLabels.length - 1, 1)) * axisLength;
        return (
          <Text 
            key={`x-tick-${i}`} 
            position={[xPos, -0.5, 0]} 
            fontSize={0.3} 
            color="#666666"
          >
            {label}
          </Text>
        );
      })}

      {/* Y-axis tick labels */}
      {yTickValues.map((value, i) => {
        const yPos = (value / yAxisMax) * axisLength;
        return (
          <Text 
            key={`y-tick-${i}`} 
            position={[-0.8, yPos, 0]} 
            fontSize={0.3} 
            color="#666666"
          >
            {value.toFixed(0)}
          </Text>
        );
      })}
    </group>
  );
}

// 3D Pie Chart Component
function ThreeDPieSlice({ 
  startAngle, 
  angle, 
  radius, 
  color, 
  height 
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, radius, startAngle, startAngle + angle, false);
    shape.lineTo(0, 0);

    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: height,
      bevelEnabled: false,
    });
  }, [startAngle, angle, radius, height]);

  return (
    <mesh geometry={geometry} position={[0, 0, -height / 2]}>
      <meshLambertMaterial color={color} />
    </mesh>
  );
}

// 3D Line Chart Component
function ThreeDLine({ 
  data, 
  yKey, 
  color = "#3B82F6", 
  scaleFactor, 
  yOffset,
  axisLength 
}) {
  const lineGeometry = useMemo(() => {
    if (!data || data.length < 2) return null;

    const points = data.map((item, index) => {
      const yVal = (Number(item[yKey]) || 0) * scaleFactor + yOffset;
      const xPos = (index / Math.max(data.length - 1, 1)) * axisLength;
      return new THREE.Vector3(xPos, yVal, 0);
    });

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [data,yKey, scaleFactor, yOffset, axisLength]);

  if (!lineGeometry) return null;

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={3} />
    </line>
  );
}

// 3D Scatter Chart Component
function ThreeDScatter({ 
  data, 
  yKey, 
  colors, 
  scaleFactor, 
  yOffset,
  axisLength 
}) {
  if (!data || data.length === 0) return null;

  return (
    <group>
      {data.map((item, index) => {
        const yVal = (Number(item[yKey]) || 0) * scaleFactor + yOffset;
        const xPos = (index / Math.max(data.length - 1, 1)) * axisLength;
        
        return (
          <mesh key={index} position={[xPos, yVal, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshLambertMaterial color={colors[index] || "#3B82F6"} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ThreeDChartWrapper({ chartType, excelData, xKey, yKey }) {
  const chartData = useMemo(() => {
    if (!excelData || excelData.length === 0 || !xKey || !yKey) {
      return null;
    }

    const yValues = excelData.map(d => Number(d[yKey]) || 0);
    const maxVal = Math.max(...yValues);
    const minVal = Math.min(...yValues);
    const range = maxVal - minVal || 1;
    const scaleFactor = 5 / range;
    const yOffset = -minVal * scaleFactor;

    const xLabels = excelData.map(item => String(item[xKey]));
    const colors = generateColors(excelData.length);

    const yTickValues = [minVal, minVal + range / 2, maxVal].filter((v, i, arr) => 
      arr.indexOf(v) === i
    );

    return {
      yValues,
      maxVal,
      minVal,
      scaleFactor,
      yOffset,
      xLabels,
      colors,
      yTickValues,
      axisLength: 8
    };
  }, [excelData, xKey, yKey]);

  if (!chartData) {
    return (
      <div className="h-96 w-full bg-gray-100 rounded-lg shadow-inner flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Please select X-axis, Y-axis, and a file to visualize data in 3D.
        </p>
      </div>
    );
  }

  const { yValues, maxVal, scaleFactor, yOffset, xLabels, colors, yTickValues, axisLength } = chartData;

  return (
    <div className="h-96 w-full bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg shadow-inner">
      <Canvas camera={{ position: [12, 8, 12], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.4} />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
        />

        <ThreeDAxis
          axisLength={axisLength}
          xLabel={xKey}
          yLabel={yKey}
          xTickLabels={xLabels}
          yTickValues={yTickValues}
          yAxisMax={maxVal}
        />

        {chartType === "3dColumn" && excelData.map((item, index) => {
          const yVal = Number(item[yKey]) || 0;
          const height = Math.max((yVal - chartData.minVal) * scaleFactor + 0.2, 0.2);
          const xPos = (index / Math.max(excelData.length - 1, 1)) * axisLength;

          return (
            <ThreeDBar
              key={`bar-${index}`}
              position={[xPos, height / 2 + yOffset, 0]}
              size={[0.6, height, 0.6]}
              color={colors[index]}
            />
          );
        })}

        {chartType === "3dPie" && (
          <group position={[axisLength / 2, 2, 0]}>
            {(() => {
              let startAngle = 0;
              const total = yValues.reduce((sum, val) => sum + val, 0);
              return yValues.map((value, index) => {
                const angle = (value / total) * Math.PI * 2;
                const slice = (
                  <ThreeDPieSlice
                    key={`pie-${index}`}
                    startAngle={startAngle}
                    angle={angle}
                    radius={2}
                    color={colors[index]}
                    height={0.8}
                  />
                );
                startAngle += angle;
                return slice;
              });
            })()}
          </group>
        )}

        {chartType === "3dLine" && (
          <ThreeDLine
            data={excelData}
            xKey={xKey}
            yKey={yKey}
            color="#3B82F6"
            scaleFactor={scaleFactor}
            yOffset={yOffset}
            axisLength={axisLength}
          />
        )}

        {chartType === "3dScatter" && (
          <ThreeDScatter
            data={excelData}
            xKey={xKey}
            yKey={yKey}
            colors={colors}
            scaleFactor={scaleFactor}
            yOffset={yOffset}
            axisLength={axisLength}
          />
        )}
      </Canvas>
    </div>
  );
}