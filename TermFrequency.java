import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore.Entry;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;



import java.io.BufferedReader;
import java.io.*;


public class TermFrequency {

public static int limit;

public static void main(final String[] args) {

    final String fileName = args[0];

    limit = Integer.parseInt(args[1]);
    
    

   print(sortDictionary(frequencyDictionary(noStopWords(splitString(removeUppercase(replaceNonWords(fileIn(fileName))))))));
   
    
  }

  

  public static String fileIn(String fileName)
  {
    final StringBuilder sb = new StringBuilder();
    try (final BufferedReader br = new BufferedReader(new FileReader(fileName, StandardCharsets.UTF_8));) {
      String line;
      while ((line = br.readLine()) != null) {
        sb.append(line); 
        sb.append('\n');
      }
      return sb.toString();
    } catch (final IOException ex) {
      return null; //no outputs in pipeline
    }
  }

  public static String replaceNonWords(String in)
  {
    return in.replaceAll("[\\W_]+", " ");
  }   

  public static String removeUppercase(String in)
  {
    return in.toLowerCase();
  }  

  public static String[] splitString(String in)
  {
    return in.split(" ");
  } 


  public static List<String> noStopWords(String[] in)
  {
     List<String> list = new ArrayList<>(Arrays.asList(in));
    List<String> stopWords = Arrays.asList(splitString(removeUppercase(replaceNonWords(fileIn("stop_words.txt")))));
    
    
    List<String> letters = Arrays.asList("a", "b", "c","d", "e", "f","g","h","i", "j", "k","l", "m", "n","o", "p", "q","r","s","w", "x", "y","z");

    list.removeAll(stopWords);
    list.removeAll(letters);

    return list;
  } 

  public static Map<String,Integer> frequencyDictionary(List<String> in)
  {
    final Map<String,Integer> dict = new HashMap<String,Integer>();

    
    for (final String element : in) 
    {
        if(dict.containsKey(element))
        {
            dict.put(element, dict.get(element) + 1);
        }
        else
        {
            dict.put(element,1);
        }
    }
    return dict;
  } 


  private static Map<String, Integer> sortDictionary(Map<String, Integer> in)
    {
        List wordList = new LinkedList(in.entrySet());
       
        Collections.sort(wordList, new Comparator() 
        {
             public int compare(Object w2, Object w1) 
             {
                return ((Comparable) ((Map.Entry) (w1)).getValue())
                   .compareTo(((Map.Entry) (w2)).getValue());
             }
        });
 
        
        HashMap out = new LinkedHashMap<String,Integer>();
        for (Iterator iter = wordList.iterator(); iter.hasNext();) {
               Map.Entry entry = (Map.Entry) iter.next();
               out.put(entry.getKey(), entry.getValue());
        } 
        return out;

        
    }

    public static void print(Map<String, Integer> in)
    {
        

        int count=0;
        for (final String key : in.keySet() ) 
        {
            if(count<limit)
            {
                final Integer value = in.get(key);
                System.out.println(key + "  -  " + value);
                count++;
            }
            else
            {
                break;
            }
          }
    } 
 
    

}

