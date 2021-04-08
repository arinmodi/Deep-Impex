import firebase from '@react-native-firebase/app';
import at from '@react-native-firebase/auth';
import db from '@react-native-firebase/database';
import fs from '@react-native-firebase/firestore';
import st from '@react-native-firebase/storage';
import fun from '@react-native-firebase/functions';

export const f = firebase;
export const auth = at();
export const storage = st();
export const functions = fun();
export const firestore = fs();
export const database = db();
export const timestamp = firebase.firestore;