import { Pressable, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';

import React from 'react'

const Home = () => {
  async function handleSignOut() {
    await supabase.auth.signOut();
  }


  return (
    <>
      <View>
        <Pressable onPress={() => {
          supabase.auth.signOut();
        }}>
          <Text>Sign Out</Text>
        </Pressable>
        <Text>Home</Text>
      </View>
    </>
  )
}

export default Home
