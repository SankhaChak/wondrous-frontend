import React, { createContext, useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleSheet, View, ScrollView, Text, Image, SafeAreaView, Dimensions, Pressable } from 'react-native'
import ProgressCircle from 'react-native-progress-circle'
import * as Analytics from 'expo-firebase-analytics'

import { RootStackParamList } from '../../types'
import { Header } from '../../components/Header'
import { categories, projectSetupStyles } from './ProjectSetupCategory'
import { spacingUnit } from '../../utils/common'
import { Black, Blue600, Yellow300, Grey300, White, Orange, Grey500 } from '../../constants/Colors'
import { Subheading, RegularText, Paragraph, ErrorText } from '../../storybook/stories/Text'
import { PrimaryButton } from '../../storybook/stories/Button'
import { useMutation, useQuery } from '@apollo/client'
import BigMouthSmile from '../../assets/images/emoji/openMouthSmile'
import { withAuth, useMe } from '../../components/withAuth'
import { CREATE_USER_INTERESTS } from '../../graphql/mutations'
import { GET_USER_INTERESTS } from '../../graphql/queries'
import { LogEvents } from '../../utils/analytics'

const UserInterestCategoryContext = createContext(null)


const CategoryItem = ({ category }) => {
  const CategoryImage = category.image
  const { interests, setInterests, setError, error } = useContext(UserInterestCategoryContext)
  let categoryColors = null
  const title = category.title.toLowerCase()
  if (interests.includes(title)) {
    categoryColors = {
      iconColor: White,
      backgroundColor: Blue600
    }
  }

  return (
      <View style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }} key={category.title}>
        <Pressable onPress={() => {
          if (interests.includes(title)) {
            // Remove from interests
            const filteredInterests = interests.filter(interest => interest !== title)
            setInterests(filteredInterests)
          } else {
            if (interests.length < 3) {
              const newInterests = [...interests, title]
              setInterests(newInterests)
            }
          }
        }} style={{
          alignItems: 'center'
        }}>
          <CategoryImage backgroundColor={(categoryColors && categoryColors?.backgroundColor) || '#F0F4FE'} iconColor={category && categoryColors?.iconColor} />
          <RegularText color={Blue600} style={{
            marginTop: spacingUnit
          }} > {category.title} </RegularText>
        </Pressable>
      </View>
  )
}

const CategoryRow = ({ threeCategories }) => {
  return (
    <View style={projectSetupStyles.categoryRowContainer}>
      {
        threeCategories.map(category => <CategoryItem category={category} key={category.title} />)
      }
    </View>
  )
}

const CategoryDisplay = ({ categories }) => {
  categories = Object.values(categories)
  const newCategories = []
  
  for (let i = 0; i < categories.length; i = i + 3) {
    newCategories.push(categories.slice(i, i + 3))
  }

  return (
    <View style={projectSetupStyles.categoryContainer}>
      <Subheading style={{
          marginBottom: spacingUnit,
          fontSize: 32,
          marginTop: spacingUnit,
        }} color={Black}>
          Pick 3 areas of interests
      </Subheading>
      <Paragraph style={{
        textAlign: 'center',
        paddingLeft: spacingUnit * 2,
        paddingRight: spacingUnit * 2
      }} color={Grey500}>
        So we can recommend the right people for you to follow!
      </Paragraph>
      {
        newCategories.map((threeCategories, index) => (
          <CategoryRow threeCategories={threeCategories} key={index} />
        ))
      }
    </View>
  )
}

function UserInterestCategoryScreen({
  navigation,
  route
}: StackScreenProps<RootStackParamList, 'UserInterestCategory'>) {
  const user = useMe()
  const [createUserInterests] = useMutation(CREATE_USER_INTERESTS, {
    refetchQueries: [{
      query: GET_USER_INTERESTS,
      variables: {
        userId: user?.id
      }
    }]
  })

  const {
    data,
    error: getUserInterestError,
  } = useQuery(GET_USER_INTERESTS, {
    variables: {
      userId: user?.id
    }
  })
  const edit = route?.params?.edit
  const [interests, setInterests] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (data?.getUserInterests?.interests?.length > 0) {
      setInterests(data?.getUserInterests?.interests)
    }
  }, [data])

  return (
    <SafeAreaView style={{
      backgroundColor: White,
      flex: 1
    }}>
      <ScrollView>
      <UserInterestCategoryContext.Provider value={{
        interests,
        setInterests,
        error,
        setError
      }}>
        <Header rightButton={{
        color: Orange,
        text: 'Continue',
        onPress: async () => {
          if (interests.length === 0) {
            setError('Please select some interests')
          } else {
            await createUserInterests({
              variables: {
                interests
              }
            })
            try {
              Analytics.logEvent(LogEvents.PICK_USER_INTERESTS, {
                user_id: user?.id,
                interests
              })
            } catch(err) {
              console.error('failed to analyse pick user interests: ', err)
            }
            navigation.push('FollowRecommendation')
            if (!edit) {
              // navigation.push('FollowRecommendation')
            } else {

            }
          }
        }
      }}/>
        {!edit &&
        <View style={projectSetupStyles.progressCircleContainer}>
          <ProgressCircle
              percent={70}
              radius={50}
              borderWidth={10}
              color={Yellow300}
              shadowColor={Grey300}
              bgColor={White}
          >
              <BigMouthSmile />
          </ProgressCircle>
          <View style={projectSetupStyles.stepContainer}>
            <Text style={projectSetupStyles.stepCount}>step 3/4</Text>
          </View>
        </View>
        }
        {
          error &&
          <View style={{
            alignItems: 'center'
          }}>
            <ErrorText>
              {error}
            </ErrorText>
          </View>
        }
        <CategoryDisplay categories={categories} />
      </UserInterestCategoryContext.Provider>
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuth(UserInterestCategoryScreen)
