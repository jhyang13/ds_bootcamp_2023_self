Attribute VB_Name = "sheets2"
Sub sheets2():

Dim i As Double
Dim j As Double
Dim ope As Double
Dim total As Double
Dim greatin As Double
Dim greatinname As String
Dim greatde As Double
Dim greatdename As String
Dim greatto As Double
Dim greattoname As String

For Each ws In Worksheets

    ws.Cells(1, 9).Value = "Ticker"
    ws.Cells(1, 10).Value = "Yearly Change"
    ws.Cells(1, 11).Value = "Percent Change"
    ws.Cells(1, 12).Value = "Total Stock Volume"
    
    ws.Cells(1, 16).Value = "Ticker"
    ws.Cells(1, 17).Value = "Value"
    ws.Cells(2, 15).Value = "Greatest % increase"
    ws.Cells(3, 15).Value = "Greatest % decrease"
    ws.Cells(4, 15).Value = "Greatest total volume"
    
    'the ticker column
    j = 2
    
    For i = 2 To ws.Cells(Rows.Count, 1).End(xlUp).Row

        If ws.Cells(i, 1).Value <> ws.Cells(i + 1, 1).Value Then
    
            ws.Cells(j, 9).Value = ws.Cells(i, 1).Value
    
            j = j + 1
            
        End If
    Next i
    
    'the yearly change column and the percent change column
    j = 2
    
    ope = ws.Cells(2, 3).Value
    
    For i = 2 To ws.Cells(Rows.Count, 1).End(xlUp).Row

        If ws.Cells(i, 1).Value <> ws.Cells(i + 1, 1).Value Then
    
            ws.Cells(j, 10).Value = ws.Cells(i, 6).Value - ope
            
            ws.Cells(j, 11).Value = (ws.Cells(i, 6).Value - ope) / ope
            
            ws.Cells(j, 11).NumberFormat = "0.00%"
            
            ope = Val(ws.Cells(i + 1, 3))
                            
            j = j + 1
            
        End If
    Next i
    
    'the total stock volume column
    j = 2
    
    total = 0
    
    For i = 2 To ws.Cells(Rows.Count, 1).End(xlUp).Row

        If ws.Cells(i, 1).Value = ws.Cells(i + 1, 1).Value Then
        
            total = total + ws.Cells(i, 7).Value
    
        Else
        
            ws.Cells(j, 12).Value = total
            
            total = 0
                            
            j = j + 1
            
        End If
    Next i
    
    'the greatest % increase and decrease
    greatin = ws.Cells(2, 11)
    greatde = ws.Cells(2, 11)
    
     For i = 2 To ws.Cells(Rows.Count, 11).End(xlUp).Row

        If ws.Cells(i, 11).Value > greatin Then
        
            greatin = Val(ws.Cells(i, 11).Value)
            greatinname = ws.Cells(i, 9).Value
            
        End If
        
        If ws.Cells(i, 11).Value < greatde Then
        
            greatde = Val(ws.Cells(i, 11).Value)
            greatdename = ws.Cells(i, 9).Value
            
        End If
    Next i
    
    ws.Cells(2, 16).Value = greatinname
    ws.Cells(2, 17).Value = greatin
    ws.Cells(2, 17).NumberFormat = "0.00%"
    ws.Cells(3, 16).Value = greatdename
    ws.Cells(3, 17).Value = greatde
    ws.Cells(3, 17).NumberFormat = "0.00%"
    
    'the great total volume
    greatto = ws.Cells(2, 12)
    
    For i = 2 To ws.Cells(Rows.Count, 12).End(xlUp).Row

        If ws.Cells(i, 12).Value > greatto Then
        
            greatto = Val(ws.Cells(i, 12).Value)
            greattoname = ws.Cells(i, 9).Value
            
        End If
    Next i
    
    ws.Cells(4, 16).Value = greattoname
    ws.Cells(4, 17).Value = greatto
    ws.Cells(4, 17).NumberFormat = "###0??"
    
    'add color to yearly change
    For i = 2 To ws.Cells(Rows.Count, 10).End(xlUp).Row

        If ws.Cells(i, 10).Value < 0 Then
    
            ws.Cells(i, 10).Interior.ColorIndex = 3
            
        Else
        
            ws.Cells(i, 10).Interior.ColorIndex = 4
            
        End If
    Next i
    
Next ws

End Sub
