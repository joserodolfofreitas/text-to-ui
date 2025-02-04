import React from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Stack,
  IconButton,
} from '@mui/material'

// Import ALL Material-UI icons individually
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckIcon from '@mui/icons-material/Check'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import HomeIcon from '@mui/icons-material/Home'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ListIcon from '@mui/icons-material/List'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import InfoIcon from '@mui/icons-material/Info'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import HelpIcon from '@mui/icons-material/Help'
import MailIcon from '@mui/icons-material/Mail'
import PhoneIcon from '@mui/icons-material/Phone'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import PrintIcon from '@mui/icons-material/Print'
import CameraIcon from '@mui/icons-material/Camera'
import ImageIcon from '@mui/icons-material/Image'
import MovieIcon from '@mui/icons-material/Movie'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FolderIcon from '@mui/icons-material/Folder'
import FileIcon from '@mui/icons-material/InsertDriveFile'
import LinkIcon from '@mui/icons-material/Link'
import LockIcon from '@mui/icons-material/Lock'
import UnlockIcon from '@mui/icons-material/LockOpen'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeDownIcon from '@mui/icons-material/VolumeDown'
import VolumeMuteIcon from '@mui/icons-material/VolumeMute'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import StopIcon from '@mui/icons-material/Stop'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import LoopIcon from '@mui/icons-material/Loop'
import ShuffleIcon from '@mui/icons-material/Shuffle'

// Create the preview scope with all components and icons
export const previewScope = {
  // React
  React,
  
  // MUI Components
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Stack,
  IconButton,

  // MUI Icons - explicitly added to scope
  SearchIcon,
  MenuIcon,
  AddIcon,
  DeleteIcon,
  EditIcon,
  CloseIcon,
  ArrowUpwardIcon,
  ArrowDownwardIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
  CheckIcon,
  SettingsIcon,
  PersonIcon,
  HomeIcon,
  MoreVertIcon,
  AccountCircleIcon,
  NotificationsIcon,
  DashboardIcon,
  ListIcon,
  SaveIcon,
  ShareIcon,
  FavoriteIcon,
  StarIcon,
  InfoIcon,
  WarningIcon,
  ErrorIcon,
  HelpIcon,
  MailIcon,
  PhoneIcon,
  ChatIcon,
  SendIcon,
  DownloadIcon,
  UploadIcon,
  PrintIcon,
  CameraIcon,
  ImageIcon,
  MovieIcon,
  MusicNoteIcon,
  FolderIcon,
  FileIcon,
  LinkIcon,
  LockIcon,
  UnlockIcon,
  VolumeUpIcon,
  VolumeDownIcon,
  VolumeMuteIcon,
  PlayArrowIcon,
  PauseIcon,
  StopIcon,
  FastForwardIcon,
  FastRewindIcon,
  LoopIcon,
  ShuffleIcon,
} as const

// Debug what's in the scope
console.log('Preview scope keys:', Object.keys(previewScope).sort())
console.log('SearchIcon in preview scope:', 'SearchIcon' in previewScope)

// Export the type
export type PreviewScope = typeof previewScope
