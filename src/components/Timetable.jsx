import React,{useEffect,useState,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Timetable.css';
import {StopsContext} from './StopsContext';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },

  significantDelay:{
    color:'red',
  },

  slightDelay:{
    color:'yellow'
  },

  onTime:{
    color:'green'
  }
});

// definito ritardo lieve se inferiore a 5 minuti, significativo se superiore


export default function Timetable(props) {
  const classes = useStyles();
  const slightDelay = 5; //min.
  const [linees,setLinees] = useState([]);
  const [renderTable,setRenderTable] = useState(false);
  const [,,,setLinePredictions] = useContext(StopsContext);
  
  const organizePredictionForLinees = () => {

    if( props.info !== undefined ){

      let predictions = [{
        line:"",
        predictions:[]
      }];

      
      for (let index = 0; index < props.info.length; index++) {
        const element = props.info[index];
        let isFind = false;
        

        let predictionsOfTheSameLine = {
          line:"",
          predictions:[]
        }

        
        for (let j = 0; j < predictions.length; j++) {
          const groupOfPredictions = predictions[j];

          if(groupOfPredictions.line === element.line){

            isFind = true;
            groupOfPredictions.predictions.push(element);
          }
            
        }
        if(!isFind){
        
          predictionsOfTheSameLine.line = element.line;
          predictionsOfTheSameLine.predictions.push(element);
  
          predictions.push(predictionsOfTheSameLine);

        }

      }

      setLinees(predictions);
      setRenderTable(true);
          
    }



  }

  useEffect(() => {

    organizePredictionForLinees();

  },[ props.info, props.previsionsNumber]);
  
  

  const getColorByDelay = (delayInMilliSeconds) => {

    let delayType;
    let delayInSeconds = delayInMilliSeconds/1000;

    if(delayInSeconds < 60){

      delayType = "onTime";
    }
    else{

      let delayInMinutes = Math.round(delayInSeconds/60);

      if(delayInMinutes <= slightDelay){

        delayType = "slightDelay";

      }
      else{

        delayType = "significantDelay";
      }

    }

    return delayType;

  }

  const showAllLinePredictions = (predictions) => {

    if(predictions.length > 1){

      console.log(predictions)
      setLinePredictions(predictions);
    }

  }
  

  if(renderTable){
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Line</TableCell>
              <TableCell align="right">Destination</TableCell>
              <TableCell align="right">Wait</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {linees.map((row,i) => {

              if(row.predictions.length !== 0){
                
                let color = getColorByDelay( row.predictions[0].delay);
          
                return(
                  <TableRow key={i} onClick={() => {showAllLinePredictions(row.predictions);}}>
                  <TableCell component="th" scope="row"> {row.predictions[0].line}</TableCell>
                  <TableCell align="right">{row.predictions[0].destination}</TableCell>
                  <TableCell align="right">{<div className={color}>{row.predictions[0].wait}</div>}</TableCell>
                  </TableRow>
                );

              }
              else{
                return(<> </>);
              }
            })}         
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  else{

    return(<> <CircularProgress /> </>);
  }
}