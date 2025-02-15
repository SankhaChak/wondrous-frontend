import React, { useEffect, useState, useRef } from 'react'
import { 
  View,
  Text,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  TouchableOpacity
} from 'react-native'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'
import { Bar } from 'react-native-progress'
import Toast from 'react-native-toast-message'

import { Orange, Blue400, Green400, White, Grey400, Grey450, Purple, Red400, Yellow300, Grey300, Grey350, Grey800, Blue500, Black, Grey200, Grey100 } from '../../../constants/Colors'
import AddIcon from '../../../assets/images/add-dark-button'
import { RegularText, TinyText, Paragraph } from '../Text'
import { formatDueDate, redDate, sortByDueDate } from '../../../utils/date'
import { spacingUnit, renderMentionString } from '../../../utils/common'
import PriorityFlame from '../../../assets/images/modal/priority'
import { Tag } from '../../../components/Tag'
import { useNavigation, useRoute } from '@react-navigation/native'
import apollo from '../../../services/apollo'
import { CREATE_TASK, NUDGE_GOAL } from '../../../graphql/mutations'
import RightCaret from '../../../assets/images/right-caret'
import { styles } from './styles'
import { CHECK_USER_FOLLOWS_BACK, GET_TASKS_FROM_GOAL } from '../../../graphql/queries'
import TaskIcon from '../../../assets/images/task/standalone'
import { Card } from './index'
import { useMe } from '../../../components/withAuth'
import { FullScreenTaskModal } from '../../../components/Modal/TaskModal'
import { StatusSelector } from '../../../components/Status/StatusSelector'
import Nudge from '../../../assets/images/actions/nudge'

export const GoalCard = ({
  icon,
  iconSize,
  type,
  redirect,
  redirectParams,
  route,
  item,
  onSwipeRight,
  onSwipeLeft,
  swipeEnabled,
}) => {
  const user = useMe()
  const [status, setStatus] = useState('created')
  const navigation = useNavigation()
  const [taskModalVisible, setTaskModalVisible] = useState(false)
  const [followBack, setFollowBack] = useState(null)
  const [clicked, setClicked] = useState(false)
  const Icon = icon
  const name = item?.name
  const dueDate = item?.dueDate
  const projectName = item?.project?.name
  const onboarding = item?.additionalData?.onboarding

  const description = item?.detail
  const priority = item?.priority
  const completedAt = item?.completedAt
  const initialTaskCount = item?.taskCount
  const completedTaskCount = item?.completedTaskCount
  const [tasks, setTasks] = useState(item?.tasks || [])
  const [nudgeGoal] = useMutation(NUDGE_GOAL, {
    variables: {
      goalId: item?.id
    },
    onCompleted: () => {
      Toast.show({
        text1: 'Nudge successfully sent!',
        position: 'bottom',
      })
    }
  })
  const [taskCount, setTaskCount] = useState(initialTaskCount || 0)
  const itemRefs = useRef(new Map())
  const {
    data: followBackData
  } = useQuery(CHECK_USER_FOLLOWS_BACK, {
    variables: {
      userId: item?.ownerId
    }
  })

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: (createTaskData) => {
      setTasks(sortByDueDate([...tasks, createTaskData?.createTask]))
      setTaskCount(taskCount + 1)
    }
  })

  const [getTasksFromGoal, {
    data: goalTasksData
  }] = useLazyQuery(GET_TASKS_FROM_GOAL, {
    fetchPolicy: 'network-only',
    onCompleted: (goalTasksData) => {
      if (goalTasksData) {
        setTasks(goalTasksData?.getTasksFromGoal)
      }
    }
  })

  const sortPriority = () => {
    switch(priority) {
      case 'high':
        return Red400
      case 'medium':
        return Yellow300
      case 'low':
        return Blue400
    }
  }

  const isRedDate = redDate(dueDate)

  useEffect(() => {
    if (item?.tasks) {
      setTasks(item?.tasks)
    }
    if (status) {
      if (!unassigned) {
        getTasksFromGoal({
          variables: {
            goalId: item?.id,
            status
          }
        })
      }
    }
    if (followBackData) {
      setFollowBack(followBackData?.doesUserFollowBack)
    }
  }, [item?.tasks, status, followBackData])
  let progress = 0
  if (completedTaskCount && completedTaskCount !== 0) {
    progress = completedTaskCount /  taskCount
  }
  const unassigned = item?.unassigned
  const showTasks = () => {
    if (!taskCount && !unassigned) {
      navigation.push(redirect, redirectParams)
    }
    if (taskCount || unassigned) {
      if (!clicked) {
        getTasksFromGoal({
          variables: {
            goalId: item?.id,
            status
          }
        })
      }
      setClicked(!clicked)
    }
  }
  if (unassigned && initialTaskCount === 0) {
    return null
  }

  return (
      <View>
      <FullScreenTaskModal setModalVisible={setTaskModalVisible} isVisible={taskModalVisible} taskMutation={createTask} goalId={item?.id} projectId={item?.projectId} />
        <TouchableWithoutFeedback onPress={showTasks}>
        <View style={[styles.row, { 
          borderRadius: spacingUnit,
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: clicked ? Orange : White,
          justifyContent: 'space-between',
          ...(clicked && {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          })
        }]}>
            <View style={[styles.topInfoContainer, styles.flex]}>
              {/* {
                profilePicture && 
                <SafeImage src={profilePicture} style={styles.profilePicture} />
              } */}
              <View style={{
                marginLeft: -4
              }}>
              {
                icon &&
                (
                  unassigned
                  ?
                  <TaskIcon style={{
                    width: iconSize,
                    height: iconSize
                  }} />
                  :
                  <Icon style={{
                    width: iconSize,
                    height: iconSize
                  }} />
                )

              }
              </View>
              <View style={{
                flex: 20
              }}>
              <Text style={[styles.text, {
                marginLeft: spacingUnit,
                paddingRight: 4,
                color: clicked ? White : Black
              }]}>{renderMentionString({ content: name, textStyle: styles.text, navigation, tab: route && route.params && route.params.tab })}</Text>
              </View>
              {
                status === 'created' && followBack &&
                <>
                <View style={{
                  flex: 1
                }} />
                <TouchableOpacity style={{
                  marginLeft: spacingUnit
                }} onPress={() => nudgeGoal()}>
                  <Nudge color={Yellow300} />
                </TouchableOpacity>
                </>
              }
            </View>
            {
              description &&
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: spacingUnit,
                marginBottom: spacingUnit,
                flex: 1
              }}>
                <Paragraph color={clicked ? White : Grey800} style={{
                  fontSize: 16
                }}>
                  {renderMentionString({ content: description, textStyle: {
                    fontSize: 16,
                    color: clicked ? White : Grey800
                  }, navigation, tab: route && route.params && route.params.tab })}
                </Paragraph>
              </View>
            }
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: spacingUnit,
              flex: 1
            }}>
              <View style={[styles.bottomInfoContainer, {
                flex: 1,
                flexWrap: 'wrap'
              }]}>
                {
                  priority &&
                  <PriorityFlame color={sortPriority()} style={{
                    // marginLeft: spacingUnit,
                    marginRight: spacingUnit * 1.5
                  }} />
                }
                {
                  projectName &&
                  <Tag color={Purple} style={{
                    marginRight: spacingUnit,
                    marginBottom: spacingUnit
                  }}>
                    <RegularText color={White}>
                      {projectName}
                    </RegularText>
                  </Tag>
                }
                {dueDate && !completedAt &&  
                    <RegularText color={isRedDate ? Red400 : (clicked ? White : Grey450)} style={styles.dueText}>
                    Due {formatDueDate(new Date(dueDate))}
                  </RegularText>
                }
              </View>
              <View>
                {
                  item?.status === 'completed' &&
                  <Tag color={Green400} style={{
                  }}>
                    <RegularText color={White}>
                      Completed {formatDueDate(new Date(completedAt))}
                    </RegularText>
                  </Tag>
                }
                {
                  item?.status === 'archived' &&
                  <Tag color={Grey300}>
                    <RegularText color={Grey800}>
                      Archived
                    </RegularText>
                  </Tag>
                }
              </View>
            </View>
            {
              !unassigned && 
              <View style={{
                flex: 1,
                width: '100%',
                marginTop: spacingUnit,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
              <View>
                <Bar width={Dimensions.get('window').width - (32 * 4) - (spacingUnit * 2)} progress={progress} color={Blue500} height={spacingUnit * 1.25} unfilledColor={Grey350} borderWidth={0} />
              </View>
              <RegularText color={clicked ? White : Grey800} style={{
                  marginLeft: spacingUnit
                }}>
                  {completedTaskCount || 0}/{taskCount || 0}
                </RegularText>
                {
                  taskCount === 0 &&
                  <Pressable onPress={() => setTaskModalVisible(true)} style={{
                    alignSelf: 'flex-start',
                    marginBottom: -spacingUnit
                  }}>
                      <AddIcon style={{
                        width: spacingUnit * 6,
                        height: spacingUnit * 6
                      }} />
                  </Pressable>
                }
              </View>
            }
            {
              (taskCount !== 0 || unassigned) &&
              <Pressable style={{
                marginTop: spacingUnit,
                flex: 1,
                alignContent: 'center',
                alignSelf: 'center'
              }} onPress={showTasks}>
                <Paragraph color={clicked ? White : Grey800} style={{
                  alignSelf: 'center'
                }}>
                  {
                    clicked
                    ?
                    ''
                    :
                    'View all tasks'
                  }
                </Paragraph>
              </Pressable>
            }
          </View>
      </TouchableWithoutFeedback>
      {
        clicked &&
        <Pressable style={{
          borderWidth: 1,
          borderColor: Grey400,
          borderTopWidth: 0,
          marginTop: -spacingUnit * 2,
          borderRadius: spacingUnit,
          marginBottom: spacingUnit * 2,
          backgroundColor: Grey100,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingBottom: spacingUnit
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            {
              !unassigned &&
              <>
              <StatusSelector setStatus={setStatus} status={status} section={'tasks'} style={{
                marginBottom: spacingUnit,
                marginTop: -spacingUnit
              }}/>
              {
                !onboarding &&
                <>
                <Pressable onPress={() => setTaskModalVisible(true)} style={{
                  marginTop: spacingUnit * 2,
                  marginLeft: -spacingUnit * 2
                }}>
                    <AddIcon style={{
                      width: spacingUnit * 7,
                      height: spacingUnit * 7
                    }} />
                </Pressable>
                  </>
              }
                <View style={{
                  flex: 1
                }} />
                  <Pressable style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginRight: spacingUnit,
                    marginTop: spacingUnit
                  }} onPress={() => {
                    navigation.push(redirect, redirectParams)
                  }}>
                    <RegularText color={Blue400}>
                      Goal Details
                    </RegularText>
                    <RightCaret color={Blue400} style={{
                      // width: spacingUnit,
                      height: spacingUnit * 1.5,
                      marginLeft: spacingUnit * 0.25
                    }}/>
                  </Pressable>
                </>
            }

          </View>
          {
            onboarding &&
            <Paragraph color={Grey800} style={{
              paddingLeft: spacingUnit * 2
            }}>
              Click for more information and swipe right to complete these tasks.
            </Paragraph>
          }
          <View style={{
            marginTop: spacingUnit
          }}>
          {
            tasks && tasks?.map(task => {
              const icon = TaskIcon
              const iconSize = spacingUnit * 3
              const redirect = 'Root'
              const redirectParams = {
                screen: route?.params?.tab || 'Profile',
                params: {
                  screen: 'TaskPage',
                  params: {
                    task
                  }
                }
              }
              const newOnSwipeRight = () => {
                const newTasks = tasks.filter(existingTask => existingTask?.id !== task?.id)
                setTasks(newTasks)
                onSwipeRight(task, 'task')
              }
              const newOnSwipeLeft = () => {
                const newTasks = tasks.filter(existingTask => existingTask?.id !== task?.id)
                setTasks(newTasks)
                onSwipeLeft(task, 'task')
              }
              return (
                <View key={task?.id} style={{
                  flex: 1,
                  marginLeft: spacingUnit * 2,
                  marginRight: spacingUnit * 2
                }}>
                  <Card
                    key={task?.id}
                    navigation={navigation}
                    followBack={followBack}
                    route={route}
                    redirect={redirect}
                    redirectParams={redirectParams}
                    type='task'
                    icon={icon}
                    iconSize={iconSize}
                    profilePicture={user && (user.thumbnailPicture || user.profilePicture)}
                    item={task}
                    swipeEnabled={swipeEnabled}
                    itemRefs={itemRefs && itemRefs.current}
                    onSwipeRight={newOnSwipeRight}
                    onSwipeLeft={newOnSwipeLeft}
                  />
                </View>
              )
            })
          }
          </View>
        </Pressable>
      }

      </View>
  )
}
