import 'react';
import 'react-dom';
import component from "./component";
import './index.css';
import './main.scss';
import './inline.css?inline';
import { shake } from './shake';

shake();
document.body.appendChild(component());