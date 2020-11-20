import React,{useEffect,useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 600,
  },
});



export default function Timetable(props) {
  const classes = useStyles();
  

  

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
          {props.info.map((row,i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row"> {row.line}</TableCell>
              <TableCell align="right">{row.destination}</TableCell>
              <TableCell align="right">{row.wait}</TableCell>
            </TableRow>
          ))}         
        </TableBody>
      </Table>
    </TableContainer>
  );
}
