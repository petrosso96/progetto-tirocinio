import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Timetable.css'

const useStyles = makeStyles({
  table: {
    minWidth: 600,
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



export default function Timetable(props) {
  const classes = useStyles();
  const slightDelay = 10; //min.
  

  const getColorByDelay = (delayInMilliSeconds) => {

    let delayType;

    if(delayInMilliSeconds === 0){

      delayType = "onTime";
    }
    else{

      let delayInSeconds = delayInMilliSeconds/1000;

      if(delayInSeconds >= 60){

        let delayInMinutes = Math.round(delayInSeconds/60);

        if(delayInMinutes <= slightDelay){

          delayType = "slightDelay";

        }
        else{

          delayType = "significantDelay";
        }


      }
      else{

        delayType = "onTime";

      }
    }

    return delayType;

  }
  

  
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
          {props.info.map((row,i) => {

            let color = getColorByDelay( row.delay);
          
            return(
            <TableRow key={i}>
              <TableCell component="th" scope="row"> {row.line}</TableCell>
              <TableCell align="right">{row.destination}</TableCell>
              <TableCell align="right">{<div className={color}>{row.wait}</div>}</TableCell>
            </TableRow>
            );
          })}         
        </TableBody>
      </Table>
    </TableContainer>
  );
}
