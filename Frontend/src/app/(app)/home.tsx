import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import dummyData from '@/data/dummy_data.json';
import { useState, useEffect } from 'react';
import HumanBodyModel from '@/components/body-modeling'
import Chat from '@/components/chat';

const selectedBodyPart = dummyData.selectedBodyPart;
// const selectedPartData = dummyData.bodyParts.find((part) => part.name === selectedBodyPart);

const Home = () => {
  const [majorBodyPart, setMajorBodyPart] = useState(dummyData.selectedBodyPart);

  return (
    <View style={styles.screen}>
      {/* <BodyModel majorBodyPart={majorBodyPart}
        setMajorBodyPart={setMajorBodyPart} /> */}
      <View style={styles.modelViewport}>
        <HumanBodyModel onSelectBodyPart={setMajorBodyPart} />
      </View>
      <BodyDetailsList majorBodyPart={majorBodyPart} />
      <Chat />
    </View >
  );
};

const BodyModel = ({ majorBodyPart, setMajorBodyPart }: { majorBodyPart: string | null, setMajorBodyPart: (part: string | null) => string }) => {

  return (
    <>
      <View style={styles.modelSection}>
        <View style={styles.modelViewport}>
          <Text style={styles.modelTitle}>{dummyData.modelPlaceholder.title}</Text>
          <Text style={styles.modelSubtitle}>{dummyData.modelPlaceholder.subtitle}</Text>
          <Text style={styles.zoomHint}>Zoom area</Text>
          {dummyData.bodyParts.map((bodyparts) => (
            <Pressable
              key={bodyparts.name}
              onPress={() => setMajorBodyPart(bodyparts.name)}
              style={styles.bodyPartButton}>
              <Text style={styles.bodyPartButtonText}>{bodyparts.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  )
};

const BodyDetailsList = ({ majorBodyPart }: { majorBodyPart: string }) => {
  const [minorBodyPart, setMinorBodyPart] = useState<string | null>(null);
  const selectedMajor = dummyData.bodyParts.find(
    (part) => part.name === majorBodyPart
  );

  const selectedMinor = selectedMajor?.children.find(
    (part) => part.name === minorBodyPart
  );
  // each levels are hardcoded right now, use array to make it dynamic later for scalability
  // const selectedMinorMinor =selectedMinor?.children.find(
  //   (part) => part.name === minorBodyPart.//doesthis attribute have to be static?
  // );
  return (
    <View style={styles.detailsSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.eyebrow}>Selected area</Text>
        <Text style={styles.sectionTitle}>{majorBodyPart}</Text>
      </View>

      <View style={styles.bodyPartColumns}>
        <View style={styles.bodyPartColumn}>
          {selectedMajor?.children.map((group) => (
            <Pressable
              key={group.name}
              style={styles.detailCard}
              onPress={() => setMinorBodyPart(group.name)}
            >
              <Text style={styles.detailTitle}>{group.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.bodyPartColumn}>
          {selectedMinor?.children?.map((item) => (
            <Pressable
              key={item.name}
              style={styles.detailCard}
              onPress={() => {
                // later: set selected 3rd-level part
              }}
            >
              <Text style={styles.detailItem}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    gap: 16,
  },
  modelSection: {
    height: 300,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelViewport: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#eef2ff',
    overflow: 'hidden',
  },
  modelTitle: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '800',
  },
  modelSubtitle: {
    color: '#475569',
    fontSize: 15,
  },
  zoomHint: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  detailsSection: {
    minHeight: 160,
    maxHeight: 220,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  sectionHeader: {
    width: 120,
    gap: 2,
    flexShrink: 0,
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
  },
  detailGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bodyPartColumns: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  bodyPartColumn: {
    width: 180,
    gap: 8,
  },
  detailCard: {
    minHeight: 44,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  detailTitle: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  detailItem: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },

  bodyPartButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },

  bodyPartButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyPartButtonText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default Home;
