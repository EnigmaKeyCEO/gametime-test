import React, { ReactNode, useState } from "react";
import { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { Photo } from "./Photo";

const ENDPOINT = "https://jsonplaceholder.typicode.com/photos?_limit=5";

export default function App() {
  const [photoArray, setPhotoArray] = useState<Array<Photo>>([]);
  const [selected, setSelected] = useState<Photo>();
  useEffect(() => {
    (async function () {
      const response = await fetch(ENDPOINT);
      const photos: Array<Photo> = await response.json();
      setPhotoArray(photos as Array<Photo>);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FullSizePhoto photo={selected} />
      <PhotoStrip
        photos={photoArray}
        selected={selected}
        setSelected={setSelected}
      ></PhotoStrip>
    </View>
  );
}

const FullSizePhoto = ({ photo }) => (
  <SafeAreaView style={styles.fullSizePhotoWrapper}>
    {(typeof photo == "undefined" && (
      <Text style={styles.fullSizePhotoText}>Select a Photo</Text>
    )) || [
      <Text key="title" style={styles.fullSizePhotoText}>
        {photo.title}
      </Text>,
      <Image
        key="fullsize"
        style={styles.fullSizePhotoImage}
        source={{ uri: photo.url }}
      />,
    ]}
  </SafeAreaView>
);

interface PhotoStripProps {
  photos: Array<Photo>;
  selected?: Photo;
  setSelected: (photo: Photo) => void;
}

interface PhotoProps {
  photo?: Photo;
}

const PhotoStrip = ({ photos, selected, setSelected }: PhotoStripProps) => {
  const { width } = useWindowDimensions();
  const Photo = ({ photo }: PhotoProps) =>
    !photo ? null : (
      <Image
        style={{
          ...styles.photoStripPhoto,
          ...(selected && selected.id == photo.id && styles.selectedPhoto),
          width,
        }}
        source={{ uri: photo.url }}
      />
    );
  return !photos || photos.length == 0 ? (
    <Text>Loading...</Text>
  ) : (
    <ScrollView
      // style={{ ...styles.photoStrip, width: width }}
      contentContainerStyle={{
        // alignItems: "center",
        flexDirection: 'row',
        justifyContent: "flex-start",
      }}
    >
      {photos.map((photo: Photo) => (
        <TouchableOpacity
          key={photo.id}
          style={styles.thumbnail}
          onPress={() => setSelected(photo)}
        >
          <Photo photo={photo} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles: any = StyleSheet.create({
  thumbnail: {
    // height: '100%',
    // width: '50%',
  },
  fullSizePhotoWrapper: {
    height: "80%",
    flex: 12,
    flexDirection: "column",
  },
  fullSizePhotoText: {
    fontSize: 26,
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  fullSizePhotoImage: {
    flex: 11,
    flexDirection: "row",
    borderWidth: 3,
    borderColor: "black",
  },
  photoWrapper: {},
  selectedPhoto: {
    borderWidth: 3,
    borderColor: "red",
  },
  photoStrip: {
    felx: 1,
    flexDirection: "row",
    overflow: "scroll",
    borderWidth: 2,
    borderColor: "black",
  },
  photoStripPhoto: {
    height: "100%",
    paddingVertical: "25%",
  },
  container: {
    flex: 1,
    backgroundColor: "#EEE",
    alignItems: "center",
    justifyContent: "center",
  },
});
