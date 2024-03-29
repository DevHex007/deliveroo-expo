import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  UserIcon,
  ChevronDownIcon,
  SearchIcon,
  AdjustmentsIcon,
} from "react-native-heroicons/outline";
import { icons } from "../constants";
import Categories from "../components/Categories";
import FeatureRow from "../components/FeatureRow";

import sanityClient from "../sanity";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `
          *[_type == "featured"] {
            ...,
            restaurants[] => {
              ...,
              dishes[] ->
               
              }
          }

          `
      )
      .then((data) => {
        setFeaturedCategories(data);
      });
  }, []);

  return (
    <SafeAreaView className="bg-white pt-5" style={styles.droidSafeArea}>
      {/** Header */}
      <View className="flex-row pb-3 items-center mx-4 space-x-2">
        <Image
          source={icons.burger}
          className="h-7 bg-gray-300 rounded-full"
          style={{
            height: 60,
            width: 60,
          }}
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">Deliver Now</Text>
          <Text className="font-bold text-xl">
            Current Location
            <ChevronDownIcon size={20} color="#00ccbb" />
          </Text>
        </View>
        <UserIcon size={35} color="#00ccbb" />
      </View>
      {/** Search  */}
      <View className="flex-row items-center space-x-2 pb-2 mx-4">
        <View className="flex-row space-x-2 flex-1 bg-gray-200 p-3">
          <SearchIcon color="gray" size={20} />
          <TextInput
            placeholder="Restaurants and cuisines"
            keyboardType="default"
          />
        </View>
        <AdjustmentsIcon color="#00ccbb" />
      </View>

      {/** Body */}
      <ScrollView
        className="bg-gray-100"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/** Categories */}
        <Categories />
        {/** Featured */}
        {featuredCategories?.map((category) => {
          return(
            <FeatureRow
            key={category._id}
            id={category._id}
            title={category.name}
            description={category.short_description}
          />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 45 : 0,
  },
});
export default HomeScreen;
