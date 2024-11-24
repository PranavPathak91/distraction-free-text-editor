class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTimes: [],
      stateUpdateTimes: [],
      componentMountTimes: []
    };

    this.performanceMarks = {};
  }

  // Start performance tracking for a specific operation
  start(markName) {
    this.performanceMarks[markName] = performance.now();
    performance.mark(`${markName}-start`);
  }

  // End performance tracking and calculate duration
  end(markName) {
    const startTime = this.performanceMarks[markName];
    if (!startTime) {
      console.warn(`No start time found for mark: ${markName}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    performance.mark(`${markName}-end`);
    performance.measure(markName, `${markName}-start`, `${markName}-end`);

    this.recordMetric(markName, duration);

    return duration;
  }

  // Record performance metric
  recordMetric(metricName, duration) {
    if (!this.metrics[metricName]) {
      this.metrics[metricName] = [];
    }

    this.metrics[metricName].push(duration);

    // Keep only last 100 measurements
    if (this.metrics[metricName].length > 100) {
      this.metrics[metricName].shift();
    }
  }

  // Calculate performance statistics
  getMetricStats(metricName) {
    const measurements = this.metrics[metricName] || [];
    
    if (measurements.length === 0) return null;

    return {
      average: this.calculateAverage(measurements),
      median: this.calculateMedian(measurements),
      max: Math.max(...measurements),
      min: Math.min(...measurements)
    };
  }

  // Calculate average of an array of numbers
  calculateAverage(arr) {
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  // Calculate median of an array of numbers
  calculateMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];
  }

  // Log performance metrics
  logPerformance() {
    console.group('Performance Metrics');
    Object.keys(this.metrics).forEach(metricName => {
      const stats = this.getMetricStats(metricName);
      if (stats) {
        console.log(`${metricName} Performance:`, stats);
      }
    });
    console.groupEnd();
  }

  // React component performance wrapper
  withPerformanceTracking(WrappedComponent) {
    return class extends React.Component {
      constructor(props) {
        super(props);
        performanceMonitor.start('componentMount');
      }

      componentDidMount() {
        performanceMonitor.end('componentMount');
      }

      render() {
        performanceMonitor.start('componentRender');
        const renderResult = <WrappedComponent {...this.props} />;
        performanceMonitor.end('componentRender');
        return renderResult;
      }
    };
  }

  // Throttle and debounce utility
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }
}

const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
