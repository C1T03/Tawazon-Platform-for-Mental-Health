import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register proper font for English text
Font.register({
  family: 'OpenSans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf',
      fontWeight: 'normal'
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: 'OpenSans',
    fontSize: 9,
    lineHeight: 1.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '2 solid #4faa84',
  },
  logoIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#4faa84',
  },
  platformName: {
    fontSize: 14,
    color: '#4faa84',
    fontFamily: 'OpenSans',
  },
  title: {
    fontSize: 16,
    color: '#4faa84',
    fontFamily: 'OpenSans',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 10,
    color: '#227552',
    marginBottom: 12,
    textAlign: 'center',
  },
  mainHeading: {
    fontSize: 12,
    color: '#4faa84',
    fontFamily: 'OpenSans',
    marginTop: 8,
    marginBottom: 6,
    textAlign: 'left',
  },
  subHeading: {
    fontSize: 10,
    color: '#227552',
    fontFamily: 'OpenSans',
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'left',
  },
  section: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: '#f8fffe',
    borderRadius: 3,
    border: '1 solid #e0f2f1',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    padding: 4,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  label: {
    fontSize: 9,
    color: '#555',
    textAlign: 'left',
    flex: 1,
  },
  value: {
    fontSize: 9,
    color: '#227552',
    fontFamily: 'OpenSans',
    textAlign: 'right',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: '1 solid #e0e0e0',
    paddingTop: 6,
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  columnLast: {
    flex: 1,
    marginRight: 0,
  },
});

const StatisticsPDF = ({ statistics, doctorStatistics, patientStatistics }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const isoDate = currentDate.toISOString().split('T')[0];

  // Use only real API data - no defaults
  const stats = statistics;
  const doctorStats = doctorStatistics;
  const patientStats = patientStatistics;

  // Return null if no data from API
  if (!stats || !doctorStats || !patientStats) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logoIcon}>⚖️</Text>
          <Text style={styles.platformName}>Balance</Text>
        </View>

        <Text style={styles.title}>Mental Health Platform Statistics Report</Text>
        <Text style={styles.subtitle}>Comprehensive Analytics Dashboard - Generated on {formattedDate}</Text>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.mainHeading}>Platform Overview</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Users</Text>
                <Text style={styles.value}>{stats.overview?.totalUsers?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Registered Doctors</Text>
                <Text style={styles.value}>{stats.overview?.totalDoctors?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Active Patients</Text>
                <Text style={styles.value}>{stats.overview?.totalPatients?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Posts</Text>
                <Text style={styles.value}>{stats.overview?.totalPosts?.toLocaleString() || '0'}</Text>
              </View>
            </View>

            <Text style={styles.mainHeading}>Demographics</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Male Users</Text>
                <Text style={styles.value}>{stats.genderDistribution?.male?.toLocaleString() || '0'} ({((stats.genderDistribution?.male / stats.overview?.totalUsers) * 100).toFixed(1)}%)</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Female Users</Text>
                <Text style={styles.value}>{stats.genderDistribution?.female?.toLocaleString() || '0'} ({((stats.genderDistribution?.female / stats.overview?.totalUsers) * 100).toFixed(1)}%)</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Other</Text>
                <Text style={styles.value}>{stats.genderDistribution?.other?.toLocaleString() || '0'}</Text>
              </View>
            </View>

            <Text style={styles.mainHeading}>Age Distribution</Text>
            <View style={styles.section}>
              {stats.ageDistribution?.map((age, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{age.ageRange}</Text>
                  <Text style={styles.value}>{age.count?.toLocaleString() || '0'}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.columnLast}>
            <Text style={styles.mainHeading}>Doctor Statistics</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Doctors</Text>
                <Text style={styles.value}>{doctorStats.overview?.totalDoctors?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Avg Experience</Text>
                <Text style={styles.value}>{doctorStats.overview?.averageExperience?.toFixed(1) || '0'} years</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Avg Consultation Fee</Text>
                <Text style={styles.value}>${doctorStats.overview?.averageConsultationFee?.toLocaleString() || '0'}</Text>
              </View>
            </View>

            <Text style={styles.mainHeading}>Specializations</Text>
            <View style={styles.section}>
              {doctorStats.specializationDistribution?.map((spec, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{spec.specialization}</Text>
                  <Text style={styles.value}>{spec.count?.toLocaleString() || '0'}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.mainHeading}>Geographic Distribution</Text>
            <View style={styles.section}>
              {stats.cityDistribution?.slice(0, 5).map((city, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.label}>{city.city || 'Unknown'}</Text>
                  <Text style={styles.value}>{city.count?.toLocaleString() || '0'}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.mainHeading}>Patient Insights</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.label}>Total Patients</Text>
                <Text style={styles.value}>{patientStats.overview?.totalPatients?.toLocaleString() || '0'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Average Age</Text>
                <Text style={styles.value}>{patientStats.overview?.averageAge?.toFixed(1) || '0'} years</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Balance Mental Health Platform</Text>
          <Text>Generated: {isoDate}</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default StatisticsPDF;