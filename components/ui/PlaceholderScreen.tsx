import { StyleSheet, Text, View } from 'react-native';

type PlaceholderScreenProps = {
  title: string;
  subtitle: string;
  dark?: boolean;
};

export function PlaceholderScreen({ title, subtitle, dark = false }: PlaceholderScreenProps) {
  return (
    <View style={[styles.root, dark && styles.darkRoot]}>
      <Text style={[styles.title, dark && styles.darkText]}>{title}</Text>
      <Text style={[styles.subtitle, dark && styles.darkSubtitle]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: '#F6FBFB',
  },
  darkRoot: {
    backgroundColor: '#0D1B2A',
  },
  title: {
    color: '#0A4F54',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#617779',
    fontSize: 16,
    textAlign: 'center',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkSubtitle: {
    color: '#B8DADD',
  },
});
