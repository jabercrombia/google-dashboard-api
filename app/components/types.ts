export interface DimensionValue {
  value: string;
}

export interface MetricValue {
  value: string;
}

export interface Row {
  dimensionValues: DimensionValue[];
  metricValues: MetricValue[];
}

export interface Data {
  rows?: Row[];
}
