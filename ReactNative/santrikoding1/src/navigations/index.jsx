
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import screens
import PostCreate from '../screens/posts/Create';
import PostEdit from '../screens/posts/Edit';
import PostIndex from '../screens/posts/Index';
const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
      <Stack.Navigator>
        <Stack.Screen
          name="PostIndex"
          component={PostIndex}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostCreate"
          component={PostCreate}
          options={{title: 'Create Post'}}
        />
        <Stack.Screen
          name="PostEdit"
          component={PostEdit}
          options={{title: 'Edit Post'}}
        />
      </Stack.Navigator>
  );
}
